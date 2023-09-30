"use client";

import styles from "@/styles/main.module.scss";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/features/notificationSlice";

export default function NewRepairOrder() {
  const dispatch = useDispatch();

  const handleAddNewOrder = () => {
    dispatch(showNotification({ message: "Tạo phiếu thành công", type: "success" }));
  };

  return (
    <div className={styles["dashboard__neworder"]}>
      <h1>Tạo phiếu bảo hành</h1>
      <div className={styles["dashboard_neworder__actions"]}>
        <button onClick={handleAddNewOrder} className={styles["button"]}>
          Thêm mới
        </button>
      </div>
      <div className={styles["dashboard__neworder__content"]}>
        <div className={styles["dashboard__neworder__content__info"]}>
          <div className={styles["dashboard__neworder__content__info__box"]}>
            <h3>&#10112; Thông tin khách hàng</h3>
          </div>
          <div className={styles["dashboard__neworder__content__info__box"]}>
            <h3>&#10113; Thông tin đơn hàng</h3>
          </div>
        </div>
        <div className={styles["dashboard__neworder__content__product"]}>
          <h3>&#10114; Sản phẩm bảo hành</h3>
        </div>
      </div>
    </div>
  );
}
