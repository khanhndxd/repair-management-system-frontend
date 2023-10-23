"use client";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "@/styles/main.module.scss";
import { hideDialog } from "@/store/features/dialogSlice";

export default function NewCustomerForm() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({});

  const onSubmit = (data) => {
    console.log(data);
    dispatch(hideDialog());
  };

  const handleCloseForm = () => {
    dispatch(hideDialog());
  };

  return (
    <form
      className={
        dialog.show === true ? styles["dialog__content__box"] : styles["dialog__content__box--hidden"]
      }
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="name">Tên</label>
        <input type="text" id="name" {...register("name")} />
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="address">Địa chỉ</label>
        <input type="text" id="address" {...register("address")} />
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="phone">Số điện thoại</label>
        <input type="text" id="phone" {...register("phone")} />
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" {...register("email")} />
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="ghi-chu">Ghi chú</label>
        <textarea id="ghi-chu" name="ghi-chu" rows="10" cols="50" {...register("ghi-chu")} />
      </div>
      <div className={styles["dialog__content__box__actions"]}>
        <button onClick={handleCloseForm} className={styles["button"]}>
          Hủy
        </button>
        <button style={{ marginLeft: "auto" }} type="submit" className={styles["button"]}>
          Tạo mới khách hàng
        </button>
      </div>
    </form>
  );
}
