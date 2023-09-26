import styles from "@/styles/main.module.scss";
import Link from "next/link";

export default function Login() {
  return (
    <div className={styles["login"]}>
      <div className={styles["box-login"]}>
        <h1>Đăng nhập</h1>
        <div className={styles["box-login__input"]}>
          <label htmlFor="usename">Tài khoản (email)</label>
          <input type="text"></input>
        </div>
        <div className={styles["box-login__input"]}>
          <label htmlFor="usename">Mật khẩu</label>
          <input type="password"></input>
        </div>
        <div className={styles["box-login__actions"]}>
          <button className={styles["button"]}>Đăng nhập</button>
        </div>
      </div>
    </div>
  );
}
