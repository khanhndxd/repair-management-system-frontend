"use client";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "@/styles/main.module.scss";
import { hideDialog } from "@/store/features/dialogSlice";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import { useChangePasswordMutation } from "@/services/api/user/userApi";

export default function ChangePasswordForm() {
  const dispatch = useDispatch();
  const [changePassword, { loading }] = useChangePasswordMutation();
  const dialog = useSelector((state) => state.dialog);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = async (data) => {
    if (data["new-password"].length < 6) {
      dispatch(showNotification({ message: "Mật khẩu phải ít nhất 6 ký tự", type: "warning" }));
      return null;
    }
    dispatch(showLoading({ content: "Đang đổi mật khẩu..." }));
    try {
      await changePassword({
        userId: dialog.info.id,
        oldPassword: data["old-password"],
        newPassword: data["new-password"],
      }).unwrap();

      dispatch(hideLoading());
      dispatch(showNotification({ message: "Đổi mật khẩu thành công", type: "success" }));
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
        <label htmlFor="old-password">Mật khẩu cũ</label>
        <input type="password" id="old-password" {...register("old-password", { required: true })} />
        {errors["old-password"] && <span style={{ color: "#cc3300" }}>Không được để trống mật khẩu cũ</span>}
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="new-password">Mật khẩu mới</label>
        <input type="password" id="new-password" {...register("new-password", { required: true })} />
        {errors["new-password"] && <span style={{ color: "#cc3300" }}>Không được để trống mật khẩu mới</span>}
      </div>
      <div className={styles["dialog__content__box__actions"]}>
        <button onClick={handleCloseForm} className={styles["button"]}>
          Hủy
        </button>
        <button style={{ marginLeft: "auto" }} type="submit" className={styles["button"]}>
          Đổi mật khẩu
        </button>
      </div>
    </form>
  );
}
