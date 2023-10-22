"use client";
import { showNotification } from "@/store/features/notificationSlice";
import styles from "@/styles/main.module.scss";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function Customers() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleAddCustomer = () => {
    dispatch(showNotification({ message: "Bắt đầu tạo mới khách hàng", type: "info" }));
  };

  return (
    <div className={styles["dashboard__customers"]}>
      <h1>Quản lý khách hàng</h1>
      <div className={styles["dashboard__customers__actions"]}>
        <button onClick={handleAddCustomer} className={styles["button"]}>
          + Tạo mới khách hàng
        </button>
      </div>
      <div className={styles["dashboard__customers__content"]}></div>
    </div>
  );
}
