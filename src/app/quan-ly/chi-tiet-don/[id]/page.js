"use client";
import RepairAccessoryList from "@/components/pages/quan-ly/chi-tiet-don/RepairAccessoryList";
import RepairOrderProductList from "@/components/pages/quan-ly/chi-tiet-don/RepairOrderProductList";
import { showNotification } from "@/store/features/notificationSlice";
import styles from "@/styles/main.module.scss";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

const statuses = [
  { value: 1, label: "Chờ xử lý" },
  { value: 2, label: "Đã tiếp nhận" },
  { value: 3, label: "Đang sửa chữa" },
  { value: 4, label: "Đã chuyển sản phẩm về hãng" },
  { value: 5, label: "Đã nhận sản phẩm từ hãng" },
  { value: 6, label: "Đã sửa xong" },
  { value: 7, label: "Đã hủy" },
  { value: 8, label: "Đã hoàn thành" },
  { value: 9, label: "Đã trả hàng" },
];

export default function RepairOrderDetail() {
  const [status, setStatus] = useState(1);
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    let chosenStatus;
    for (let i = 0; i < statuses.length; i++) {
      if (statuses[i].value === +e.target.value) {
        chosenStatus = statuses[i].label;
      }
    }
    dispatch(
      showNotification({
        message: `Đã chuyển trạng thái đơn sang "${chosenStatus}"`,
        type: "info",
      })
    );
  };
  
  const handleAcceptOrder = () => {
    dispatch(showNotification({ message: "Nhân viên đã tiếp nhận đơn", type: "success" }));
  };

  const handleAddAccessory = () => {};

  return (
    <div className={styles["dashboard__orderdetail"]}>
      <div className={styles["dashboard__orderdetail__header"]}>
        <span onClick={handleBack}>&#10140;</span>
        <h1>Chi tiết phiếu bảo hành</h1>
      </div>
      <div className={styles["dashboard__orderdetail__actions"]}>
        <h2>{params.id} - Phiếu tiếp nhận bảo hành</h2>
        <div className={styles["dashboard__orderdetail__actions__buttons"]}>
          <button onClick={handleAcceptOrder} className={styles["button"]}>
            Tiếp nhận đơn
          </button>
          <button onClick={handleAddAccessory} className={styles["button"]}>
            Thêm linh kiện
          </button>
          <select name="status-change" id="status-change" onChange={handleStatus} value={status}>
            {statuses.map((item) => {
              return (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              );
            })}
          </select>
          <button className={styles["button"]}>In</button>
        </div>
      </div>
      <div className={styles["dashboard__orderdetail__content"]}>
        <div className={styles["dashboard__orderdetail__content__box"]}>
          <h3>Phiếu tiếp nhận bảo hành - {params.id}</h3>
          <div className={styles["dashboard__orderdetail__content__box__customer"]}>
            <p>
              <strong>Tên khách hàng</strong>: Nguyễn Duy Khánh
            </p>
            <p>
              <strong>Người tạo phiếu</strong>: Mark
            </p>
            <p>
              <strong>Địa chỉ </strong>: 123 Hà Nội
            </p>
            <p>
              <strong>Người tiếp nhận</strong>: Kevin
            </p>
            <p>
              <strong>Điện thoại</strong>: 0123456789
            </p>
            <p></p>
            <p>
              <strong>Email</strong>: khanh@gmail.com
            </p>
          </div>
          <RepairOrderProductList />
          <p>
            Tổng chi phí: <strong style={{ fontSize: "24px" }}>999.999đ</strong>
          </p>
        </div>
        <div className={styles["dashboard__orderdetail__content__box"]}>
          <div className={styles["dashboard__orderdetail__content__box__header"]}>
            <h4>Thông tin phiếu</h4>
            <span>Chờ xử lý</span>
          </div>
          <div className={styles["dashboard__orderdetail__content__box__info"]}>
            <p>
              <strong>Ngày tiếp nhận</strong>: 01/01/2024
            </p>
            <p>
              <strong>Ngày trả hàng</strong>: 02/01/2024
            </p>
            <p>
              <strong>Lý do bảo hành</strong>: Sản phẩm lỗi
            </p>
            <p>
              <strong>Hình thức trả hàng</strong>: Khách đến cửa hàng nhận hàng
            </p>
            <p>
              <strong>Ghi chú</strong>: Cần gấp
            </p>
          </div>
          <div>
            <p style={{ marginBottom: "4px" }}>
              <strong>Linh kiện thay thế</strong>
            </p>
            <RepairAccessoryList />
          </div>
        </div>
      </div>
    </div>
  );
}
