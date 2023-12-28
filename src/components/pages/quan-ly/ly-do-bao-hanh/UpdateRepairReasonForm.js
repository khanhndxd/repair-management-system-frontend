"use client";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "@/styles/main.module.scss";
import { hideDialog } from "@/store/features/dialogSlice";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import { useUpdateRepairReasonMutation } from "@/services/api/repairReason/repairReasonApi";

export default function UpdateRepairReasonForm() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const [updateRepairReason, { loading }] = useUpdateRepairReasonMutation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      reason: dialog.info.reason,
    },
  });

  const onSubmit = async (data) => {
    dispatch(showLoading({ content: "Đang cập nhật lý do bảo hành..." }));
    try {
      await updateRepairReason({
        Id: dialog.info.id,
        Reason: data["reason"],
      }).unwrap();

      dispatch(hideLoading());
      dispatch(showNotification({ message: "Cập nhật lý do bảo hành thành công", type: "success" }));
      dispatch(hideDialog());
    } catch (err) {
      dispatch(showNotification({ message: err.data.message, type: "error" }));
      dispatch(hideLoading());
      reset();
    }
  };

  const handleCloseForm = () => {
    dispatch(hideDialog());
  };

  return (
    <form
      className={dialog.show === true ? styles["dialog__content__box"] : styles["dialog__content__box--hidden"]}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="reason">Lý do</label>
        <input type="text" id="reason" {...register("reason", { required: true })} />
        {errors["reason"] && <span style={{ color: "#cc3300" }}>Không được để trống lý do</span>}
      </div>
      <div className={styles["dialog__content__box__actions"]}>
        <button onClick={handleCloseForm} className={styles["button"]}>
          Hủy
        </button>
        <button style={{ marginLeft: "auto" }} type="submit" className={styles["button"]}>
          Chỉnh sửa
        </button>
      </div>
    </form>
  );
}
