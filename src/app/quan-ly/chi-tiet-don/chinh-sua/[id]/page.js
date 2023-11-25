"use client";
import Loading from "@/app/loading";
import RepairOrderForm from "@/components/pages/quan-ly/tiep-nhan-bao-hanh/RepairOrderForm";
import { useAddRepairCustomerProductMutation } from "@/services/api/repairCustomerProduct/repairCustomerProductApi";
import {
  useGetRepairOrderByIdQuery,
  useUpdateRepairOrderMutation,
} from "@/services/api/repairOrder/repairOrderApi";
import { useAddRepairProductMutation } from "@/services/api/repairProduct/repairProductApi";
import { useAddRepairTaskMutation } from "@/services/api/repairTask/repairTaskApi";
import { convertFromVND } from "@/services/helper/helper";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import {
  addCustomer,
  addNewRepairProduct,
  addProduct,
  addRepairType,
  addTask,
  reset,
} from "@/store/features/repairOrderSlice";
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
  const [addRepairProduct, { loading: productLoading }] = useAddRepairProductMutation();
  const [addRepairTask, { loading: taskLoading }] = useAddRepairTaskMutation();
  const { data, isLoading, isFetching, isError, error } = useGetRepairOrderByIdQuery(params.id);
  const [addRepairCustomerProduct, { loading: repairCustomerProductLoading }] =
    useAddRepairCustomerProductMutation();

  useEffect(() => {
    if (isLoading === false && isFetching === false) {
      if (data) {
        dispatch(reset());
        dispatch(addCustomer(data.data.customer));
        dispatch(addRepairType({ object: { id: data.data.repairType.id } }));
        for (let i = 0; i < data.data.repairProducts.length; i++) {
          dispatch(
            addProduct({
              object: {
                ...data.data.repairProducts[i].purchasedProduct,
                description: data.data.repairProducts[i].description,
              },
            })
          );
        }
        for (let i = 0; i < data.data.repairTasks.length; i++) {
          dispatch(
            addTask({
              object: { ...data.data.repairTasks[i].task, description: data.data.repairTasks[i].description },
            })
          );
        }
        for (let i = 0; i < data.data.repairCustomerProducts.length; i++) {
          dispatch(
            addNewRepairProduct({
              object: {
                ...data.data.repairCustomerProducts[i].customerProduct,
                description: data.data.repairCustomerProducts[i].description,
              },
            })
          );
        }
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
        TotalPrice: convertFromVND(repairOrder.total),
        RepairTypeId: +data.repairType,
        RepairReasonId: +data.repairReason,
        Note: data.note,
      };
      const repairOrderResult = await updateRepairOrder(repairOrderPayload);
      // console.log(repairOrderResult);

      dispatch(showLoading({ content: "Đang cập nhật sản phẩm bảo hành..." }));

      let repairProductsPayload = {};
      if (repairOrder.products.length === 0) {
        repairProductsPayload = [{ RepairOrderId: params.id, purchasedProductId: -1 }];
      } else {
        repairProductsPayload = repairOrder.products.map((item) => {
          return { RepairOrderId: params.id, purchasedProductId: item.id, Description: item.description };
        });
      }
      const repairProductResult = await addRepairProduct(repairProductsPayload);
      // console.log(repairProductResult);

      dispatch(showLoading({ content: "Đang cập nhật công việc bảo hành..." }));

      let repairTasksPayload = {};
      if (repairOrder.tasks.length === 0) {
        repairTasksPayload = [{ RepairOrderId: params.id, TaskId: -1 }];
      } else {
        repairTasksPayload = repairOrder.tasks.map((item) => {
          return { RepairOrderId: params.id, TaskId: item.id, Description: item.description };
        });
      }
      const repairTaskResult = await addRepairTask(repairTasksPayload);
      // console.log(repairTaskResult);

      // Cập nhật sản phẩm mới vào bảng RepairCustomerOrder
      let repairCustomerProductPayload = {};
      if (repairOrder.newRepairProducts.length === 0) {
        repairCustomerProductPayload = [{ RepairOrderId: params.id, CustomerProductId: -1 }];
      } else {
        repairCustomerProductPayload = repairOrder.newRepairProducts.map((item) => {
          return {
            CustomerProductId: item.realId,
            RepairOrderId: params.id,
            Description: item.description,
          };
        });
      }
      const repairCustomerProductResult = await addRepairCustomerProduct(repairCustomerProductPayload);
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
          note: data.data.note,
          selectedTask: data.data.repairTasks.map((item) => item.task.id),
        }}
        onSubmit={handleEditRepairOrder}
      />
    </div>
  );
}
