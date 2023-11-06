"use client";
import { useGeneratePdfMutation } from "@/services/api/pdf/pdfApi";
import { useUpdateRepairOrderStatusMutation } from "@/services/api/repairOrder/repairOrderApi";
import { addChosenAccessory } from "@/store/features/accessoryCartSlice";
import { showDialog } from "@/store/features/dialogSlice";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import styles from "@/styles/main.module.scss";
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

export default function RepairActions(props) {
  const {
    customer,
    createdAt,
    receiveAt,
    repairOrderId,
    createdBy,
    repairedBy,
    currentStatus,
    repairAccessories,
    repairProduct,
    task,
    totalPrice,
  } = props;
  const [updateRepairOrderStatus, { loading }] = useUpdateRepairOrderStatusMutation();
  const [pdfBlob, setPdfBlob] = useState(null);
  const [status, setStatus] = useState(currentStatus);
  const dispatch = useDispatch();
  const handleStatus = async (e) => {
    dispatch(showLoading({ content: "Đang cập nhật trạng thái đơn..." }));
    await updateRepairOrderStatus({
      id: repairOrderId,
      createdById: createdBy.toString(),
      repairedById: repairedBy.toString(),
      statusId: +e.target.value,
    });
    dispatch(hideLoading());
    dispatch(
      showNotification({
        message: `Cập nhật trạng thái thành công`,
        type: "success",
      })
    );
  };

  const handleAcceptOrder = async () => {
    dispatch(showLoading({ content: "Đang cập nhật trạng thái đơn..." }));
    await updateRepairOrderStatus({
      id: repairOrderId,
      createdById: createdBy.toString(),
      repairedById: repairedBy.toString(),
      statusId: 2,
    });
    dispatch(hideLoading());
    dispatch(showNotification({ message: "Nhân viên đã tiếp nhận đơn", type: "success" }));
  };

  const handleAddAccessory = () => {
    dispatch(addChosenAccessory({ info: repairAccessories }));
    dispatch(showDialog({ title: "Thêm/chỉnh sửa thông tin linh kiện", content: "add-accessory" }));
  };

  const handleCreatePdf = async () => {
    dispatch(showLoading({ content: "Đang tạo phiếu bảo hành..." }));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/Pdf/Generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repairOrderId: repairOrderId,
          customerName: customer.name,
          customerPhone: customer.phone,
          customerAddress: customer.address,
          customerEmail: customer.email,
          createdAt: createdAt,
          receiveAt: receiveAt,
          accessories: repairAccessories.map((item) => {
            return {
              id: item.accessory.id,
              name: item.accessory.name,
              unit: item.accessory.unit,
              quantity: item.quantity,
              price: item.accessory.price,
            };
          }),
          repairProducts: repairProduct.map((item) => {
            return { id: item.purchasedProduct.productSerial, name: item.purchasedProduct.productName };
          }),
          tasks: { id: task.id, name: task.name, price: task.price },
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        console.log(blob);
        setPdfBlob(blob);
      } else {
        console.error("Lỗi khi tạo phiếu bảo hành");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    dispatch(hideLoading());
    dispatch(showNotification({ message: "Tạo phiếu bảo hành thành công.", type: "success" }));
  };

  const downloadPdf = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `phieubaohanh-${repairOrderId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={styles["dashboard__orderdetail__actions__buttons"]}>
      {currentStatus === 1 ? (
        <button onClick={handleAcceptOrder} className={styles["button"]}>
          Tiếp nhận đơn
        </button>
      ) : null}
      <button
        onClick={handleAddAccessory}
        className={currentStatus === 1 ? styles["button--disabled"] : styles["button"]}
      >
        Thêm/chỉnh sửa thông tin linh kiện
      </button>
      <select
        disabled={currentStatus === 1}
        name="status-change"
        id="status-change"
        onChange={handleStatus}
        value={status}
        style={{ opacity: currentStatus === 1 ? 0.3 : 1 }}
      >
        {statuses.map((item) => {
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
      <button
        onClick={handleCreatePdf}
        className={currentStatus === 1 || pdfBlob ? styles["button--disabled"] : styles["button"]}
      >
        Tạo phiếu bảo hành
      </button>
      {pdfBlob && (
        <button onClick={downloadPdf} className={styles["button--light"]}>
          Tải phiếu bảo hành về máy
        </button>
      )}
    </div>
  );
}
