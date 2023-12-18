"use client";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "@/styles/main.module.scss";
import { hideDialog } from "@/store/features/dialogSlice";
import { useAddCustomerMutation } from "@/services/api/customer/customerApi";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import { useUpdateUserMutation } from "@/services/api/user/userApi";

export default function UpdateAccountInfoForm() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const [updateUser, { loading }] = useUpdateUserMutation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: dialog.info.name,
      email: dialog.info.email,
      phone: dialog.info.phone,
    },
  });

  const onSubmit = async (data) => {
    if (
      !data["email"].match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      dispatch(showNotification({ message: "Sai định dạng email", type: "warning" }));
      return null;
    }
    dispatch(showLoading({ content: "Đang cập nhật thông tin người dùng..." }));
    try {
      await updateUser({
        userId: dialog.info.id,
        userName: data["name"],
        email: data["email"],
        phoneNumber: data["phone"],
      }).unwrap();

      dispatch(hideLoading());
      dispatch(showNotification({ message: "Cập nhật thông tin người dùng thành công", type: "success" }));
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
        <label htmlFor="name">Tên</label>
        <input type="text" id="name" {...register("name", { required: true })} />
        {errors["name"] && <span style={{ color: "#cc3300" }}>Không được để trống tên</span>}
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" {...register("email", { required: true })} />
        {errors["email"] && <span style={{ color: "#cc3300" }}>Không được để trống email</span>}
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="phone">Số điện thoại</label>
        <input type="text" id="phone" {...register("phone", { required: true })} />
        {errors["phone"] && <span style={{ color: "#cc3300" }}>Không được để trống số điện thoại</span>}
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
