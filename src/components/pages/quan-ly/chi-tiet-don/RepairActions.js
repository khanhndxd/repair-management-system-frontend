"use client";
import Loading from "@/app/loading";
import { useAddRepairLogMutation } from "@/services/api/repairLog/repairLogApi";
import { useUpdateRepairOrderStatusMutation } from "@/services/api/repairOrder/repairOrderApi";
import { useGetAllStatusesQuery } from "@/services/api/status/statusApi";
import { getStatusLabelByValue, statuses } from "@/services/helper/helper";
import { addChosenAccessory, reset } from "@/store/features/accessoryCartSlice";
import { showDialog } from "@/store/features/dialogSlice";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import styles from "@/styles/main.module.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RepairActions(props) {
  const {
    customer,
    createdAt,
    receiveAt,
    repairOrderId,
    createdBy,
    repairedBy,
    receivedBy,
    currentStatus,
    repairAccessories,
    repairProducts,
    repairTasks,
    repairCustomerProducts,
    repairReason,
    repairType,
    totalPrice,
  } = props;
  const { data, isLoading, isFetching, isError } = useGetAllStatusesQuery();
  const [updateRepairOrderStatus, { loading: updateStatusLoading }] = useUpdateRepairOrderStatusMutation();
  const [addRepairLog, { loading: logLoading }] = useAddRepairLogMutation();
  const [pdfBlob, setPdfBlob] = useState(null);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  if (isLoading || isFetching) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  if (isError) return <div>Có lỗi xảy ra!</div>;

  const handleStatus = async (e) => {
    dispatch(showLoading({ content: "Đang cập nhật trạng thái đơn..." }));
    try {
      const label = getStatusLabelByValue(+e.target.value);
      await updateRepairOrderStatus(
        {
          id: repairOrderId,
          createdById: createdBy.toString(),
          repairedById: repairedBy.toString(),
          receivedById: receivedBy.toString(),
          statusId: +e.target.value,
        },
        { id: repairOrderId }
      );

      const logPayload = {
        RepairOrderId: repairOrderId,
        CreatedById: auth.userId,
        CreatedAt: new Date(),
        Info: `Cập nhật trạng thái đơn thành '${label}'`,
      };
      await addRepairLog(logPayload, { id: repairOrderId });
    } catch (err) {
      console.log(err);
    }
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
    try {
      await updateRepairOrderStatus(
        {
          id: repairOrderId,
          createdById: createdBy.toString(),
          repairedById: repairedBy.toString(),
          receivedById: receivedBy.toString(),
          statusId: 2,
        },
        { id: repairOrderId }
      );

      const logPayload = {
        RepairOrderId: repairOrderId,
        CreatedById: auth.userId,
        CreatedAt: new Date(),
        Info: "Tiếp nhận đơn",
      };
      await addRepairLog(logPayload, { id: repairOrderId });
    } catch (err) {
      console.log(err);
    }
    dispatch(hideLoading());
    dispatch(showNotification({ message: "Nhân viên đã tiếp nhận đơn", type: "success" }));
  };

  const handleAddAccessory = () => {
    dispatch(reset());
    dispatch(addChosenAccessory({ info: repairAccessories }));
    dispatch(
      showDialog({
        title: "Thêm/chỉnh sửa thông tin linh kiện",
        content: "add-accessory",
        info: { totalPrice: totalPrice, repairTasks: repairTasks, repairType: repairType, repairProducts: repairProducts },
      })
    );
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
          createdBy: auth.user,
          repairReason: repairReason.reason,
          accessories: repairAccessories.map((item) => {
            return {
              id: item.accessory.id,
              name: item.accessory.name,
              unit: item.accessory.unit,
              quantity: item.quantity,
              price: item.accessory.price,
            };
          }),
          repairProducts: repairProducts.map((item) => {
            return { id: item.purchasedProduct.productSerial, name: item.purchasedProduct.productName };
          }),
          repairCustomerProducts: repairCustomerProducts.map((item) => {
            return { id: item.customerProduct.id, name: item.customerProduct.name };
          }),
          repairTasks: repairTasks.map((item) => {
            return { id: item.task.id, name: item.task.name, price: item.task.price };
          }),
          totalPrice: totalPrice,
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

  const downloadPdf = async () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `phieubaohanh-${repairOrderId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      const logPayload = {
        RepairOrderId: repairOrderId,
        CreatedById: auth.userId,
        CreatedAt: new Date(),
        Info: "Tải phiếu bảo hành",
      };
      await addRepairLog(logPayload, { id: repairOrderId });
    }
  };

  return (
    <div className={styles["dashboard__orderdetail__actions__buttons"]}>
      {data.data.length !== 0 && (
        <>
          {currentStatus === 1 ? (
            <button onClick={handleAcceptOrder} className={styles["button"]}>
              Tiếp nhận đơn
            </button>
          ) : null}
          <button onClick={handleAddAccessory} className={currentStatus === 1 ? styles["button--disabled"] : styles["button"]}>
            Thêm/chỉnh sửa thông tin linh kiện
          </button>
          <select
            disabled={currentStatus === 1}
            name="status-change"
            id="status-change"
            onChange={handleStatus}
            value={""}
            style={{ opacity: currentStatus === 1 ? 0.3 : 1 }}
          >
            <option value="" disabled hidden>
              Cập nhật trạng thái
            </option>
            {data.data.map((item) => {
              return (
                <option
                  key={item.id}
                  value={item.id}
                  disabled={currentStatus === item.id}
                  style={{ color: currentStatus === item.id ? "#ccc" : "white" }}
                >
                  {item.name}
                </option>
              );
            })}
          </select>
          <button onClick={handleCreatePdf} className={currentStatus === 1 || pdfBlob ? styles["button--disabled"] : styles["button"]}>
            Tạo phiếu bảo hành
          </button>
          {pdfBlob && (
            <button onClick={downloadPdf} className={styles["button--light"]}>
              Tải phiếu bảo hành về máy
            </button>
          )}
        </>
      )}
    </div>
  );
}
