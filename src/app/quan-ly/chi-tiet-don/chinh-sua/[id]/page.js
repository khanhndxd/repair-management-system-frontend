"use client";
import Loading from "@/app/loading";
import RepairOrderForm from "@/components/pages/quan-ly/tiep-nhan-bao-hanh/RepairOrderForm";
import { useGetRepairOrderByIdQuery } from "@/services/api/repairOrder/repairOrderApi";
import { showNotification } from "@/store/features/notificationSlice";
import { addCustomer, addProduct, addRepairType, addTask, reset } from "@/store/features/repairOrderSlice";
import styles from "@/styles/main.module.scss";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function EditRepairOrderPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, isError, error } = useGetRepairOrderByIdQuery(params.id);

  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (isLoading === false && isFetching === false) {
      if (data) {
        dispatch(addCustomer(data.data.customer));
        dispatch(addRepairType({ object: { id: data.data.repairType.id } }));
        for (let i = 0; i < data.data.repairProducts.length; i++) {
          dispatch(
            addProduct({
              object: {
                productSerial: data.data.repairProducts[i].purchasedProduct.productSerial,
                productName: data.data.repairProducts[i].purchasedProduct.productName,
              },
            })
          );
        }
        dispatch(
          addTask({
            object: { id: data.data.task.id, name: data.data.task.name, price: data.data.task.price },
          })
        );
      }
    }
  }, [isLoading, isFetching, data]);

  const handleEditRepairOrder = async (data) => {
    console.log(data);
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
