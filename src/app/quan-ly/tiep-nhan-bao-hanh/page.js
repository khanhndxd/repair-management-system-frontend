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
import { convertFromVND } from "@/services/helper/helper";
import { useAddRepairTaskMutation } from "@/services/api/repairTask/repairTaskApi";
import { useAddRepairCustomerProductMutation } from "@/services/api/repairCustomerProduct/repairCustomerProductApi";

export default function NewRepairOrder() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addRepairOrder, { loading: repairOrderLoading }] = useAddRepairOrderMutation();
  const [addRepairProduct, { loading: productLoading }] = useAddRepairProductMutation();
  const [addRepairTask, { loading: newProductLoading }] = useAddRepairTaskMutation();
  const [addRepairCustomerProduct, { loading: repairCustomerProductLoading }] =
    useAddRepairCustomerProductMutation();
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
        TotalPrice: convertFromVND(repairOrder.total),
        StatusId: 1,
        RepairTypeId: +data.repairType,
        RepairReasonId: +data.repairReason,
        Note: data.note,
      };
      const result = await addRepairOrder(payload);

      dispatch(showLoading({ content: "Đang cập nhật sản phẩm bảo hành..." }));

      // Cập nhật sản phẩm
      let repairProductsPayload = {};
      if (repairOrder.products.length === 0) {
        repairProductsPayload = [{ RepairOrderId: result.data.data, purchasedProductId: -1 }];
      } else {
        repairProductsPayload = repairOrder.products.map((item) => {
          return { RepairOrderId: result.data.data, purchasedProductId: item.id, Description: item.description };
        });
      }
      const repairProductResult = await addRepairProduct(repairProductsPayload);

      // Cập nhật công việc
      dispatch(showLoading({ content: "Đang cập nhật công việc bảo hành..." }));
      let repairTasksPayload = {};
      if (repairOrder.tasks.length === 0) {
        repairTasksPayload = [{ RepairOrderId: result.data.data, TaskId: -1 }];
      } else {
        repairTasksPayload = repairOrder.tasks.map((item) => {
          return { RepairOrderId: result.data.data, TaskId: item.id, Description: item.description };
        });
      }

      const repairTaskResult = await addRepairTask(repairTasksPayload);
      // console.log(repairTaskResult);

      // Cập nhật sản phẩm mới (nếu có)
      if (repairOrder.newRepairProducts.length !== 0) {
        // Thêm sản phẩm mới vào bảng RepairCustomerOrder
        let repairCustomerProductPayload = repairOrder.newRepairProducts.map((item) => {
          return {
            CustomerProductId: item.realId,
            RepairOrderId: result.data.data,
            Description: item.description,
          };
        });
        const repairCustomerProductResult = await addRepairCustomerProduct(repairCustomerProductPayload);
      }

      router.push(`/quan-ly/chi-tiet-don/${result.data.data}`);
    } catch (err) {
      console.log(err);
    }

    dispatch(hideLoading());
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
          note: "",
          selectedTasks: [],
        }}
        onSubmit={handleCreateRepairOrder}
      />
    </div>
  );
}
