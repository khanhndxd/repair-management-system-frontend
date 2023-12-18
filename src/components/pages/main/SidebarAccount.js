"use client";
import styles from "@/styles/main.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/store/features/authSlice";
import { showLoading } from "@/store/features/loadingAsyncSlice";
import { useEffect, useState } from "react";

export default function SidebarAccount() {
  const [user, setUser] = useState({ name: "", role: "" });
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(showLoading({ content: "Đang đăng xuất khỏi tài khoản..." }));
    dispatch(logOut());
  };

  useEffect(() => {
    if (auth) {
      setUser({ name: auth.user, role: auth.role });
    }
  }, [auth]);

  return (
    <div className={styles["sidebar__account"]}>
      <h6>{user.name}</h6>
      <button onClick={handleLogout} className={styles["button"]} style={{ marginTop: "10px" }}>
        Đăng xuất
      </button>
    </div>
  );
}
