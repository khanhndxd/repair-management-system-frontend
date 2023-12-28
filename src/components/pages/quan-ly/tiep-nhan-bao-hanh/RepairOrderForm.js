"use client";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import styles from "@/styles/main.module.scss";
import CustomerForm from "./CustomerForm";
import RepairOrderInfoForm from "./RepairOrderInfoForm";
import RepairList from "./RepairList";

export default function RepairOrderForm(props) {
  const { mode, initialValues, onSubmit } = props;
  const repairOrder = useSelector((state) => state.repairOrder);
  const {
    control,
    register,
    handleSubmit,
    resetField,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  return (
    <form className={styles["dashboard__neworder__content"]} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles["dashboard_neworder__content__actions"]}>
        <button name="submit" className={styles["button"]}>
          {mode === "create" ? "Thêm mới" : "Xác nhận chỉnh sửa"}
        </button>
      </div>
      <div className={styles["dashboard__neworder__content"]}>
        <div className={styles["dashboard__neworder__content__info"]}>
          <div className={styles["dashboard__neworder__content__info__box"]}>
            <h3>&#10112; Thông tin khách hàng</h3>
            <CustomerForm control={control} errors={errors} getValues={getValues} mode={mode} />
          </div>
          <div className={styles["dashboard__neworder__content__info__box"]}>
            <h3>&#10113; Thông tin đơn</h3>
            <RepairOrderInfoForm control={control} watch={watch} setValue={setValue} register={register} errors={errors} />
          </div>
        </div>
        <div className={styles["dashboard__neworder__content__product"]}>
          <h3>&#10114; Thông tin bảo hành</h3>
          <RepairList watch={watch} resetField={resetField} />
          <p style={{ marginLeft: "auto" }}>
            Tổng chi phí: <strong style={{ fontSize: "24px" }}>{repairOrder?.total}</strong> (Tạm tính)
          </p>
        </div>
        <div className={styles["dashboard__neworder__content__info"]}>
          <div className={styles["dashboard__neworder__content__info__box"]}>
            <h3>&#10115; Ghi chú</h3>
            <textarea id="ghi-chu" name="ghi-chu" rows="10" cols="50" placeholder="Nhập ghi chú" {...register("note")} />
          </div>
        </div>
      </div>
    </form>
  );
}
