import styles from "@/styles/main.module.scss";
import RepairOrderForm from "@/components/pages/quan-ly/tiep-nhan-bao-hanh/RepairOrderForm";

export default function NewRepairOrder() {
  return (
    <div className={styles["dashboard__neworder"]}>
      <h1>Tạo phiếu bảo hành</h1>
      <RepairOrderForm />
    </div>
  );
}
