"use client";
import RepairReasonTable from "@/components/pages/quan-ly/ly-do-bao-hanh/RepairReasonTable";
import { showDialog } from "@/store/features/dialogSlice";
import styles from "@/styles/main.module.scss";
import { useDispatch } from "react-redux";

export default function RepairReasonPage() {
  const dispatch = useDispatch();
  const handleNewRepairReason = () => {
    dispatch(showDialog({ title: "Thêm mới lý do bảo hành", content: "add-repair-reason" }));
  };
  return (
    <div className={styles["dashboard__repair-reason"]}>
      <h1>Quản lý lý do bảo hành</h1>
      <div>
        <button onClick={handleNewRepairReason} className={styles["button"]}>
          + Thêm mới lý do bảo hành
        </button>
      </div>
      <RepairReasonTable />
    </div>
  );
}
