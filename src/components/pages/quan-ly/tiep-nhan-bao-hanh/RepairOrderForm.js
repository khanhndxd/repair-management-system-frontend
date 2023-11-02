"use client";

import { showNotification } from "@/store/features/notificationSlice";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "@/styles/main.module.scss";
import CustomerForm from "./CustomerForm";
import RepairOrderInfoForm from "./RepairOrderInfoForm";
import RepairList from "./RepairList";
import { format } from "date-fns";
import { useAddRepairOrderMutation } from "@/services/api/repairOrder/repairOrderApi";

export default function RepairOrderForm() {
  const [addRepairOrder, {isLoading}] = useAddRepairOrderMutation();
  const repairOrder = useSelector((state) => state.repairOrder);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      creator: "1",
      receiver: null,
      createdDate: format(new Date(), "yyyy-MM-dd"),
      receiveDate: format(new Date(), "yyyy-MM-dd"),
      receiveType: "",
      repairType: null,
      repairReason: null,
      task: null,
      note: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    console.log(repairOrder.tasksProducts);
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
      ProductId: 1,
      ProductDescription: "test",
    };
    const result = await addRepairOrder(payload);
    console.log(result)
    dispatch(showNotification({ message: "Tạo phiếu thành công", type: "success" }));
    // router.push("/quan-ly/chi-tiet-don/1");
  };

  return (
    <form className={styles["dashboard__neworder__content"]} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles["dashboard_neworder__content__actions"]}>
        <button name="submit" className={styles["button"]}>
          Thêm mới
        </button>
      </div>
      <div className={styles["dashboard__neworder__content"]}>
        <div className={styles["dashboard__neworder__content__info"]}>
          <div className={styles["dashboard__neworder__content__info__box"]}>
            <h3>&#10112; Thông tin khách hàng</h3>
            <CustomerForm control={control} errors={errors} />
          </div>
          <div className={styles["dashboard__neworder__content__info__box"]}>
            <h3>&#10113; Thông tin đơn</h3>
            <RepairOrderInfoForm register={register} errors={errors} />
          </div>
        </div>
        <div className={styles["dashboard__neworder__content__product"]}>
          <h3>&#10114; Thông tin bảo hành</h3>
          <RepairList />
          <p style={{ marginLeft: "auto" }}>
            Tổng chi phí: <strong style={{ fontSize: "24px" }}>{repairOrder?.total} đ</strong>
          </p>
        </div>
        <div className={styles["dashboard__neworder__content__info"]}>
          <div className={styles["dashboard__neworder__content__info__box"]}>
            <h3>&#10115; Ghi chú</h3>
            <textarea
              id="ghi-chu"
              name="ghi-chu"
              rows="10"
              cols="50"
              placeholder="Nhập ghi chú"
              {...register("note")}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
