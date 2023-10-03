"use client";
import styles from "@/styles/main.module.scss";

export default function RepairOrderInfoForm(props) {
  const { register, errors } = props;

  return (
    <div className={styles["new-order-info"]}>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="creator">Người tạo phiếu</label>
        <input type="text" id="creator" {...register("creator")} />
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="receiver">Người tiếp nhận</label>
        <select id="receiver" {...register("receiver")}>
          <option value="1">Nguyễn Duy Khánh</option>
          <option value="2">Nguyễn Văn A</option>
        </select>
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="created-date">Ngày tiếp nhận</label>
        <input
          type="date"
          id="created-date"
          pattern="dd/mm/yyyy"
          {...register("created-date", { valueAsDate: true })}
        />
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="received-date">Ngày trả hàng (dự kiến)</label>
        <input
          type="date"
          id="received-date"
          pattern="dd/mm/yyyy"
          {...register("received-date", { valueAsDate: true })}
        />
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="return-type">Hình thức trả hàng</label>
        <input type="text" id="return-type" {...register("return-type")} />
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="repair-type">Lý do bảo hành</label>
        <select id="repair-type" {...register("repair-type")}>
          <option value="failure">Sản phẩm lỗi</option>
          <option value="change">Đổi hàng mới</option>
          <option value="other">Lý do khác</option>
        </select>
      </div>
    </div>
  );
}
