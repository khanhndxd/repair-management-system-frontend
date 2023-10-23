"use client";
import CustomerOrderTable from "@/components/pages/quan-ly/khach-hang/chi-tiet-khach-hang/CustomerOrderTable";
import styles from "@/styles/main.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";

const activities = [
  { value: "", label: "Giao dịch" },
  { value: 1, label: "Tiếp nhận bảo hành" },
];

export default function CustomerDetail() {
  const router = useRouter();
  const [activity, setActivity] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleActivities = (e) => {
    setActivity(e.target.value);
  };

  const handleAddRepairOrder = () => {
    router.push(`/quan-ly/tiep-nhan-bao-hanh`)
  }

  return (
    <div className={styles["dashboard__customerdetail"]}>
      <div className={styles["dashboard__customerdetail__header"]}>
        <span onClick={handleBack}>&#10140;</span>
        <h1>Chi tiết khách hàng</h1>
      </div>
      <div className={styles["dashboard__customerdetail__basic"]}>
        <div className={styles["dashboard__customerdetail__basic__image"]}></div>
        <h2>Nguyễn Duy Khánh</h2>
        <p>Chỉnh sửa</p>
      </div>
      <div className={styles["dashboard__customerdetail__info"]}>
        <div className={styles["dashboard__customerdetail__info__detail"]}>
          <h4>Thông tin phiếu</h4>
          <div className={styles["dashboard__customerdetail__info__detail__content"]}>
            <p>
              <strong>Địa chỉ:</strong> 123 ABCD
            </p>
            <p>
              <strong>Số điện thoại:</strong> 0123456789
            </p>
            <p>
              <strong>Đã mua hàng:</strong> 5 lần
            </p>
            <p>
              <strong>Đã bảo hành:</strong> 10 lần
            </p>
            <p>
              <strong>Ghi chú:</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque,
              earum repellat sit aspernatur minima eius. Officia ipsum aliquam dolor magnam pariatur eveniet
              libero, obcaecati natus. Recusandae nihil ullam eius provident odit eligendi est, tempora
              nesciunt aliquam sequi laborum, iusto fuga?
            </p>
          </div>
        </div>
        <div className={styles["dashboard__customerdetail__info__activities"]}>
          <span>
            <select name="activities" id="activities" onChange={handleActivities} value={activity}>
              {activities.map((item) => {
                return (
                  <option
                    key={item.value}
                    disabled={item.value === ""}
                    hidden={item.value === ""}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                );
              })}
            </select>
          </span>
          <div className={styles["dashboard__customerdetail__info__activities__table"]}>
            <div className={styles["dashboard__customerdetail__info__activities__table__actions"]}>
              <h5>Danh sách tiếp nhận bảo hành</h5>
              <button onClick={handleAddRepairOrder} className={styles["button"]}>Thêm đơn tiếp nhận bảo hành</button>
            </div>
            <CustomerOrderTable />
          </div>
        </div>
      </div>
    </div>
  );
}
