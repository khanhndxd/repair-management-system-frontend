"use client";
import styles from "@/styles/main.module.scss";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/features/notificationSlice";

export default function SidebarAccount() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    router.push("/dang-nhap");
    dispatch(showNotification({ message: "Đăng xuất thành công", type: "success" }));
  };

  return (
    <div className={styles["sidebar__account"]}>
      <button onClick={handleLogout} className={styles["button"]}>
        Đăng xuất
      </button>
    </div>
  );
}
