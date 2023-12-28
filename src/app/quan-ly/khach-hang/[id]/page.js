"use client";
import Loading from "@/app/loading";
import CustomerOrderTable from "@/components/pages/quan-ly/khach-hang/chi-tiet-khach-hang/CustomerOrderTable";
import { useGetCustomerByIdQuery } from "@/services/api/customer/customerApi";
import { showDialog } from "@/store/features/dialogSlice";
import { addCustomer, isOrderFromCustomerPage, reset } from "@/store/features/repairOrderSlice";
import styles from "@/styles/main.module.scss";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import UserIcon from "@/styles/icons/user.svg";

const activities = [
  { value: "", label: "Giao dịch" },
  { value: 1, label: "Tiếp nhận bảo hành" },
];

export default function CustomerDetail() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, isError } = useGetCustomerByIdQuery(params.id);
  const [activity, setActivity] = useState(1);

  const handleBack = () => {
    router.back();
  };

  const handleActivities = (e) => {
    setActivity(e.target.value);
  };

  const handleAddRepairOrder = () => {
    dispatch(
      addCustomer({
        id: data.data.id,
        name: data.data.name,
        phone: data.data.phone,
        address: data.data.address,
        email: data.data.email,
      })
    );
    dispatch(isOrderFromCustomerPage({ flag: true }));
    router.push(`/quan-ly/tiep-nhan-bao-hanh`);
  };

  const handleUpdateCustomer = () => {
    dispatch(showDialog({ title: "Chỉnh sửa thông tin khách hàng", content: "update-customer" }));
  };

  if (isError) return <div>Có lỗi xảy ra!</div>;

  if (isLoading || isFetching) return <Loading />;

  return (
    <div className={styles["dashboard__customerdetail"]}>
      <div className={styles["dashboard__customerdetail__header"]}>
        <span onClick={handleBack}>&#10140;</span>
        <h1>Chi tiết khách hàng</h1>
      </div>
      <div className={styles["dashboard__customerdetail__basic"]}>
        <Image priority src={UserIcon} width={40} height={40} alt="user" />
        <h2>{data.data.name}</h2>
        <p style={{ cursor: "pointer" }} onClick={handleUpdateCustomer}>
          Chỉnh sửa
        </p>
      </div>
      <div className={styles["dashboard__customerdetail__info"]}>
        <div className={styles["dashboard__customerdetail__info__detail"]}>
          <h4>Thông tin khách hàng</h4>
          <div className={styles["dashboard__customerdetail__info__detail__content"]}>
            <p>
              <strong>Địa chỉ:</strong> {data.data.address}
            </p>
            <p>
              <strong>Email:</strong> {data.data.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {data.data.phone}
            </p>
            <p>
              <strong>Đã mua hàng:</strong> {data.data.purchaseOrders.length} lần
            </p>
            <p>
              <strong>Đã bảo hành:</strong> {data.data.repairOrders.length} lần
            </p>
            <p>
              <strong>Ghi chú:</strong> {data.data.note}
            </p>
          </div>
        </div>
        <div className={styles["dashboard__customerdetail__info__activities"]}>
          <span>
            <select name="activities" id="activities" onChange={handleActivities} value={activity}>
              {activities.map((item) => {
                return (
                  <option key={item.value} disabled={item.value === ""} hidden={item.value === ""} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
          </span>
          <div className={styles["dashboard__customerdetail__info__activities__table"]}>
            <div className={styles["dashboard__customerdetail__info__activities__table__actions"]}>
              <h5>Danh sách tiếp nhận bảo hành</h5>
              <button onClick={handleAddRepairOrder} className={styles["button"]}>
                Thêm đơn tiếp nhận bảo hành
              </button>
            </div>
            <CustomerOrderTable repairOrders={preprocessingCustomerOrderData(data.data.repairOrders)} />
          </div>
        </div>
      </div>
    </div>
  );
}

const preprocessingCustomerOrderData = (data) => {
  const result = data.map((item) => {
    return {
      id: item.id,
      status: item.status.id,
      createdBy: item.createdBy.userName,
      repairedBy: item.repairedBy.userName,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
      receiveAt: new Date(item.receiveAt).toLocaleDateString(),
    };
  });
  return result;
};
