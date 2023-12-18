"use client";
import styles from "@/styles/main.module.scss";

export default function RepairOrderDetailInfo(props) {
  const { createdAt, receiveAt, repairReason, receiveType, note, status, repairType } = props;

  return (
    <>
      <div className={styles["dashboard__orderdetail__content__box__header"]}>
        <h4>Thông tin phiếu</h4>
        <span style={{ fontWeight: "bold" }}>{status.name}</span>
      </div>
      <div className={styles["dashboard__orderdetail__content__box__info"]}>
        <p>
          <strong>Ngày tiếp nhận</strong>: {new Date(createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Ngày trả hàng</strong>: {new Date(receiveAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Lý do bảo hành</strong>: {repairReason.reason}
        </p>
        <p>
          <strong>Loại</strong>:{" "}
          <span style={{ backgroundColor: "#9DFF20", color: "#000", fontWeight: "bold", padding: "5px", borderRadius: "5px" }}>
            {repairType.name}
          </span>
        </p>
        <p>
          <strong>Hình thức trả hàng</strong>: {receiveType}
        </p>
        <p>
          <strong>Ghi chú</strong>: {note}
        </p>
      </div>
    </>
  );
}
