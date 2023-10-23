"use client";
import NewCustomerForm from "@/components/common/NewCustomerForm";
import CustomerTable from "@/components/pages/quan-ly/khach-hang/CustomerTable";
import { showDialog } from "@/store/features/dialogSlice";
import styles from "@/styles/main.module.scss";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function Customers() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleAddCustomer = () => {
    dispatch(showDialog({ title: "Tạo mới khách hàng", content: "add-customer"}));
  };

  return (
    <div className={styles["dashboard__customers"]}>
      <h1>Quản lý khách hàng</h1>
      <div className={styles["dashboard__customers__actions"]}>
        <button onClick={handleAddCustomer} className={styles["button"]}>
          + Thêm mới khách hàng
        </button>
      </div>
      <div className={styles["dashboard__customers__content"]}>
        <CustomerTable />
      </div>
    </div>
  );
}
