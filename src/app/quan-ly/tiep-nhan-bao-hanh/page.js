"use client";

import styles from "@/styles/main.module.scss";
import RepairOrderForm from "@/components/pages/quan-ly/tiep-nhan-bao-hanh/RepairOrderForm";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { showNotification } from "@/store/features/notificationSlice";
import { useAddRepairOrderMutation } from "@/services/api/repairOrder/repairOrderApi";
import { useAddRepairProductMutation } from "@/services/api/repairProduct/repairProductApi";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { useEffect } from "react";
import { reset } from "@/store/features/repairOrderSlice";

export default function NewRepairOrder() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addRepairOrder, { isLoading }] = useAddRepairOrderMutation();
  const [updateRepairProduct, { loading: productLoading }] = useAddRepairProductMutation();
  const repairOrder = useSelector((state) => state.repairOrder);

  useEffect(() => {
    if (repairOrder.isOrderFromCustomerPage === false) {
      dispatch(reset());
    }
  }, []);

  const handleCreateRepairOrder = async (data) => {
    try {
      dispatch(showLoading({ content: "Đang tạo đơn bảo hành..." }));
      let payload = {
        CustomerId: +data.customer.id,
        CreatedById: data.creator,
        RepairedById: data.receiver,
        CreatedAt: data.createdDate,
        ReceiveAt: data.receiveDate,
        ReceiveType: data.receiveType,
        TotalPrice: repairOrder.total,
        StatusId: 1,
        RepairTypeId: +data.repairType,
        RepairReasonId: +data.repairReason,
        TaskId: +data.task,
        Note: data.note,
      };
      const result = await addRepairOrder(payload);

      dispatch(showLoading({ content: "Đang cập nhật sản phẩm bảo hành..." }));
      let repairProductsPayload = repairOrder.products.map((item) => {
        return { RepairOrderId: result.data.data, purchasedProductId: item.id };
      });
      const repairProductResult = await updateRepairProduct(repairProductsPayload);
      dispatch(hideLoading());
      router.push(`/quan-ly/chi-tiet-don/${result.data.data}`);
    } catch (err) {
      console.log(err);
    }
    dispatch(showNotification({ message: "Tạo phiếu thành công", type: "success" }));
  };
  return (
    <div className={styles["dashboard__neworder"]}>
      <h1>Tạo phiếu bảo hành</h1>
      <RepairOrderForm
        mode={"create"}
        initialValues={{
          customer: repairOrder.customer,
          creator: "1",
          receiver: null,
          createdDate: format(new Date(), "yyyy-MM-dd"),
          receiveDate: format(new Date(), "yyyy-MM-dd"),
          receiveType: "",
          repairType: null,
          repairReason: null,
          task: null,
          note: "",
        }}
        onSubmit={handleCreateRepairOrder}
      />
    </div>
  );
}
