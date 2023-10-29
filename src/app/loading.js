import styles from "@/styles/main.module.scss";

export default function Loading() {
    return (
      <div className={styles["loading"]}>
        <h4>Đang tải...</h4>
      </div>
    );
  }
  