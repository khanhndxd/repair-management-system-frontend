"use client";
import { showNotification } from "@/store/features/notificationSlice";
import styles from "@/styles/main.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function AddPurchasedProductForm() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const repairOrder = useSelector((state) => state.repairOrder);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = (data) => {
    dispatch(showNotification({ message: "Chọn sản phẩm thành công", type: "success" }));
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
        <select id="purchased-product" {...register("purchased-product", { required: true })}>
          {[].data.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {item.reason}
              </option>
            );
          })}
        </select>
    </form>
  );
}
