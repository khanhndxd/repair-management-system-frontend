"use client";
import styles from "@/styles/main.module.scss";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/features/notificationSlice";
import { logOut } from "@/store/features/authSlice";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";

export default function SidebarAccount() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(showLoading({ content: "Đang đăng xuất khỏi tài khoản..." }));
    dispatch(logOut());
  };

  return (
    <div className={styles["sidebar__account"]}>
      <button onClick={handleLogout} className={styles["button"]}>
        Đăng xuất
      </button>
    </div>
  );
}
