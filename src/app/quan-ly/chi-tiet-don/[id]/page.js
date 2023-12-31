"use client";
import Loading from "@/app/loading";
import CustomerInfo from "@/components/pages/quan-ly/chi-tiet-don/CustomerInfo";
import RepairAccessoryList from "@/components/pages/quan-ly/chi-tiet-don/RepairAccessoryList";
import RepairActions from "@/components/pages/quan-ly/chi-tiet-don/RepairActions";
import RepairOrderDetailInfo from "@/components/pages/quan-ly/chi-tiet-don/RepairOrderDetailInfo";
import RepairOrderHistory from "@/components/pages/quan-ly/chi-tiet-don/RepairOrderHistory";
import { useGetRepairOrderByIdQuery } from "@/services/api/repairOrder/repairOrderApi";
import { roles } from "@/services/helper/helper";
import styles from "@/styles/main.module.scss";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function RepairOrderDetail() {
  const router = useRouter();
  const params = useParams();
  const { data, isLoading, isFetching, isError, error } = useGetRepairOrderByIdQuery(params.id);
  const auth = useSelector((state) => state.auth);

  if (isError) return <div>Có lỗi xảy ra</div>;

  if (isLoading || isFetching) return <Loading />;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles["dashboard__orderdetail"]}>
      <div className={styles["dashboard__orderdetail__header"]}>
        <span onClick={handleBack}>&#10140;</span>
        <h1>Chi tiết phiếu bảo hành</h1>
      </div>
      <div className={styles["dashboard__orderdetail__actions"]}>
        <h2>{params.id} - Phiếu tiếp nhận bảo hành</h2>
        {auth.role === roles.technician ? null : <Link href={`/quan-ly/chi-tiet-don/chinh-sua/${params.id}`}>Chỉnh sửa</Link>}
        <RepairActions
          customer={data.data.customer}
          createdAt={data.data.createdAt}
          receiveAt={data.data.receiveAt}
          repairReason={data.data.repairReason}
          repairOrderId={data.data.id}
          createdBy={data.data.createdBy.id}
          repairedBy={data.data.repairedBy.id}
          receivedBy={data.data.repairedBy.id}
          currentStatus={data.data.status.id}
          repairAccessories={data.data.repairAccessories}
          repairProducts={data.data.repairProducts}
          repairTasks={data.data.repairTasks}
          repairCustomerProducts={data.data.repairCustomerProducts}
          repairType={data.data.repairType}
          totalPrice={data.data.totalPrice}
        />
      </div>
      <div className={styles["dashboard__orderdetail__content"]}>
        <div className={styles["dashboard__orderdetail__content__box"]}>
          <h3>
            Phiếu tiếp nhận bảo hành - {params.id} {data.data.status.id === 1 ? "(Chưa tiếp nhận đơn)" : null}
          </h3>
          <CustomerInfo
            customer={data.data.customer}
            createdBy={data.data.createdBy}
            repairedBy={data.data.repairedBy}
            receivedBy={data.data.receivedBy}
            repairProduct={data.data.repairProducts}
            repairTasks={data.data.repairTasks}
            repairCustomerProducts={data.data.repairCustomerProducts}
            repairAccessories={data.data.repairAccessories}
            total={data.data.totalPrice}
          />
        </div>
        <div className={styles["dashboard__orderdetail__content__box"]}>
          <RepairOrderDetailInfo
            createdAt={data.data.createdAt}
            receiveAt={data.data.receiveAt}
            repairReason={data.data.repairReason}
            receiveType={data.data.receiveType}
            note={data.data.note}
            status={data.data.status}
            repairType={data.data.repairType}
          />
          <div>
            <p style={{ marginBottom: "4px" }}>
              <strong>Linh kiện thay thế</strong>
            </p>
            <RepairAccessoryList repairAccessories={data.data.repairAccessories} />
          </div>
        </div>
        <div className={styles["dashboard__orderdetail__content__history"]}>
          <h3>Lịch sử thao tác</h3>
          <RepairOrderHistory repairOrderId={data.data.id} />
        </div>
      </div>
    </div>
  );
}
