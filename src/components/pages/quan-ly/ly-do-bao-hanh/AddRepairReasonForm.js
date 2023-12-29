"use client";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "@/styles/main.module.scss";
import { hideDialog } from "@/store/features/dialogSlice";
import { useAddCustomerMutation } from "@/services/api/customer/customerApi";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import { useUpdateUserMutation } from "@/services/api/user/userApi";
import { useAddRepairReasonMutation } from "@/services/api/repairReason/repairReasonApi";

export default function AddRepairReasonForm() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const [addRepairReason, { loading }] = useAddRepairReasonMutation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
    },
  });

  const onSubmit = async (data) => {
    dispatch(showLoading({ content: "Đang thêm mới lý do bảo hành..." }));
    try {
      await addRepairReason({
        reason: data["reason"],
      }).unwrap();

      dispatch(hideLoading());
      dispatch(showNotification({ message: "Thêm mới lý do bảo hành thành công", type: "success" }));
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
          Thêm mới
        </button>
      </div>
    </form>
  );
}
