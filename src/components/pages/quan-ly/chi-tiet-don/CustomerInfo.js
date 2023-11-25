"use client";
import styles from "@/styles/main.module.scss";
import RepairOrderProductList from "./RepairOrderProductList";
import { convertToVND } from "@/services/helper/helper";

export default function CustomerInfo(props) {
  const { customer, createdBy, repairedBy, repairProduct, repairTasks, repairCustomerProducts, status, total } = props;

  return (
    <>
      <div className={styles["dashboard__orderdetail__content__box__customer"]}>
        <p>
          <strong>Tên khách hàng</strong>: {customer.name}
        </p>
        <p>
          <strong>Người tạo phiếu</strong>: {createdBy.userName}
        </p>
        <p>
          <strong>Địa chỉ </strong>: {customer.address}
        </p>
        <p>
          <strong>Người tiếp nhận</strong>: {repairedBy.userName}{" "}
          {status === 1 ? "(Chưa tiếp nhận đơn)" : null}
        </p>
        <p>
          <strong>Điện thoại</strong>: {customer.phone}
        </p>
        <p></p>
        <p>
          <strong>Email</strong>: {customer.email}
        </p>
      </div>
      <RepairOrderProductList repairProduct={repairProduct} repairTasks={repairTasks} repairCustomerProducts={repairCustomerProducts} />
      <p>
        Tổng chi phí: <strong style={{ fontSize: "24px" }}>{convertToVND(total)}</strong>
      </p>
    </>
  );
}
