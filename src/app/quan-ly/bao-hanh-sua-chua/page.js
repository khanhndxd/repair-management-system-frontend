"use client";
import styles from "@/styles/main.module.scss";
import RepairOrderTable from "@/components/pages/quan-ly/bao-hanh-sua-chua/RepairOrderTable";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { showNotification } from "@/store/features/notificationSlice";

export default function Maintain() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleAddRepairOrder = () => {
    router.push("/quan-ly/tiep-nhan-bao-hanh")
    dispatch(showNotification({ message: "Bắt đầu tạo phiếu bảo hành", type: "info" }));
  };

  return (
    <div className={styles["dashboard__orders"]}>
      <h1>Quản lý bảo hành sửa chữa</h1>
      <div className={styles["dashboard__orders__actions"]}>
        <button onClick={handleAddRepairOrder} className={styles["button"]}>
          + Tạo phiếu bảo hành
        </button>
      </div>
      <div className={styles["dashboard__orders__content"]}>
        <RepairOrderTable />
      </div>
    </div>
  );
}
