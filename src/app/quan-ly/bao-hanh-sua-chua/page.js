import styles from "@/styles/main.module.scss";
export default function Maintain() {
  return (
    <div className={styles["dashboard__orders"]}>
      <h1>Quản lý bảo hành sửa chữa</h1>
      <div className={styles["dashboard__orders__content"]}>{/* <OrderTable /> */}</div>
    </div>
  );
}
