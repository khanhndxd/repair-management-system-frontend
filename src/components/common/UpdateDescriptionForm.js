"use client";
import { hideDialog } from "@/store/features/dialogSlice";
import {
  updateNewProductDescription,
  updateProductDescription,
  updateTaskDescription,
} from "@/store/features/repairOrderSlice";
import styles from "@/styles/main.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function UpdateDescriptionForm() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = async (data) => {
    let payload = { id: dialog.info.object.id, description: data.description };
    if (dialog.info.object.type === "product") {
      dispatch(updateProductDescription({ object: payload }));
    } else if (dialog.info.object.type === "task") {
      dispatch(updateTaskDescription({ object: payload }));
    } else if (dialog.info.object.type === "new") {
      dispatch(updateNewProductDescription({ object: payload }));
    }
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
        <label htmlFor="description">Mô tả</label>
        <textarea
          rows="10"
          cols="50"
          placeholder="Nhập mô tả"
          id="description"
          {...register("description")}
        />
      </div>
      <div className={styles["dialog__content__box__actions"]}>
        <button onClick={handleCloseForm} className={styles["button"]}>
          Hủy
        </button>
        <button style={{ marginLeft: "auto" }} type="submit" className={styles["button"]}>
          Cập nhật mô tả
        </button>
      </div>
    </form>
  );
}
