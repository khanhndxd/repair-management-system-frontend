"use client";

import styles from "@/styles/main.module.scss";
import RepairOrderForm from "@/components/pages/quan-ly/tiep-nhan-bao-hanh/RepairOrderForm";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { showNotification } from "@/store/features/notificationSlice";
import { useAddRepairOrderMutation } from "@/services/api/repairOrder/repairOrderApi";

export default function NewRepairOrder() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addRepairOrder, { isLoading }] = useAddRepairOrderMutation();
  const repairOrder = useSelector(state => state.repairOrder);

  const handleCreateRepairOrder = async (data) => {
    console.log(data);
    // console.log(repairOrder.tasksProducts);
    // let payload = {
    //   CustomerId: +data.customer.id,
    //   CreatedById: data.creator,
    //   RepairedById: data.receiver,
    //   CreatedAt: data.createdDate,
    //   ReceiveAt: data.receiveDate,
    //   ReceiveType: data.receiveType,
    //   TotalPrice: repairOrder.total,
    //   StatusId: 1,
    //   RepairTypeId: +data.repairType,
    //   RepairReasonId: +data.repairReason,
    //   TaskId: +data.task,
    //   Note: data.note,
    //   ProductId: 1,
    //   ProductDescription: "test",
    // };
    // const result = await addRepairOrder(payload);
    // console.log(result)
    dispatch(showNotification({ message: "Tạo phiếu thành công", type: "success" }));
    // router.push("/quan-ly/chi-tiet-don/1");
  };
  return (
    <div className={styles["dashboard__neworder"]}>
      <h1>Tạo phiếu bảo hành</h1>
      <RepairOrderForm
        mode={"create"}
        initialValues={{
          customer: null,
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
