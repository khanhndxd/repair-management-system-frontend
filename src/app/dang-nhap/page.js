"use client";
import styles from "@/styles/main.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/features/notificationSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = () => {
    router.push("/");
    dispatch(showNotification({ message: "Đăng nhập thành công", type: "success" }));
  };

  return (
    <div className={styles["login"]}>
      <h1>LOGO</h1>
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
          <button onClick={handleLogin} className={styles["button"]}>
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
