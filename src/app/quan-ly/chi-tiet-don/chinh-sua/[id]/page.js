"use client";
import Loading from "@/app/loading";
import RepairOrderForm from "@/components/pages/quan-ly/tiep-nhan-bao-hanh/RepairOrderForm";
import {
  useGetRepairOrderByIdQuery,
  useUpdateRepairOrderMutation,
} from "@/services/api/repairOrder/repairOrderApi";
import { useAddRepairProductMutation } from "@/services/api/repairProduct/repairProductApi";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import { addCustomer, addProduct, addRepairType, addTask, reset } from "@/store/features/repairOrderSlice";
import styles from "@/styles/main.module.scss";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditRepairOrderPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const repairOrder = useSelector((state) => state.repairOrder);
  const [updateRepairOrder, { loading }] = useUpdateRepairOrderMutation();
  const [updateRepairProduct, { loading: productLoading }] = useAddRepairProductMutation();
  const { data, isLoading, isFetching, isError, error } = useGetRepairOrderByIdQuery(params.id);

  useEffect(() => {
    if (isLoading === false && isFetching === false) {
      if (data) {
        dispatch(reset());
        dispatch(addCustomer(data.data.customer));
        dispatch(addRepairType({ object: { id: data.data.repairType.id } }));
        for (let i = 0; i < data.data.repairProducts.length; i++) {
          dispatch(
            addProduct({
              object: data.data.repairProducts[i].purchasedProduct,
            })
          );
        }
        dispatch(
          addTask({
            object: data.data.task,
          })
        );
      }
    }
  }, [isLoading, isFetching, data]);

  const handleEditRepairOrder = async (data) => {
    try {
      dispatch(showLoading({ content: "Đang cập nhật thông tin đơn bảo hành..." }));
      let repairOrderPayload = {
        Id: +params.id,
        CustomerId: +data.customer.id,
        CreatedById: data.creator.toString(),
        RepairedById: data.receiver.toString(),
        CreatedAt: data.createdDate,
        ReceiveAt: data.receiveDate,
        ReceiveType: data.receiveType,
        TotalPrice: repairOrder.total,
        RepairTypeId: +data.repairType,
        RepairReasonId: +data.repairReason,
        TaskId: +data.task,
        Note: data.note,
      };
      const repairOrderResult = await updateRepairOrder(repairOrderPayload);
      // console.log(repairOrderResult);

      dispatch(showLoading({ content: "Đang cập nhật sản phẩm bảo hành..." }));
      let repairProductsPayload = repairOrder.products.map((item) => {
        return { RepairOrderId: params.id, purchasedProductId: item.id };
      });
      const repairProductResult = await updateRepairProduct(repairProductsPayload);
      // console.log(repairProductResult);
    } catch (err) {
      console.log(err);
    }

    dispatch(hideLoading());
    dispatch(showNotification({ message: "Chỉnh sửa đơn bảo hành thành công", type: "success" }));
  };

  if (isError) return <div>Có lỗi xảy ra!</div>;

  if (isLoading || isFetching) return <Loading />;

  return (
    <div className={styles["dashboard__neworder"]}>
      <h1>Chỉnh sửa đơn bảo hành</h1>
      <RepairOrderForm
        mode={"edit"}
        initialValues={{
          customer: data.data.customer,
          creator: data.data.createdBy.id,
          receiver: data.data.repairedBy.id,
          createdDate: format(new Date(data.data.createdAt), "yyyy-MM-dd"),
          receiveDate: format(new Date(data.data.receiveAt), "yyyy-MM-dd"),
          receiveType: data.data.receiveType,
          repairType: data.data.repairType.id,
          repairReason: data.data.repairReason.id,
          task: data.data.task.id,
          note: data.data.note,
        }}
        onSubmit={handleEditRepairOrder}
      />
    </div>
  );
}
