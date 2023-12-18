"use client";
import AccountTable from "@/components/pages/quan-ly/tai-khoan/AccountTable";
import { showDialog } from "@/store/features/dialogSlice";
import styles from "@/styles/main.module.scss";
import { useDispatch } from "react-redux";

export default function AccountPage() {
  const dispatch = useDispatch();
  const handleAđNewAccount = () => {
    dispatch(showDialog({ title: "Tạo mới người dùng", content: "create-user" }));
  };
  return (
    <div className={styles["dashboard__account"]}>
      <h1>Quản lý tài khoản</h1>
      <div>
        <button onClick={handleAđNewAccount} className={styles["button"]}>
          + Thêm mới người dùng
        </button>
      </div>
      <AccountTable />
    </div>
  );
}
