import LoadingAsync from "@/components/common/LoadingAsync";
import styles from "@/styles/main.module.scss";

export default function LoginLayout({ children }) {
  return (
    <div className={styles["login"]}>
      <h1>ĐATN - Bảo hành sửa chữa PC và linh kiện máy tính</h1>
      {children}
    </div>
  );
}
