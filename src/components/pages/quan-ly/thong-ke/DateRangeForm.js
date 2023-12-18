"use client";
import { showNotification } from "@/store/features/notificationSlice";
import styles from "@/styles/main.module.scss";
import { differenceInDays } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function DateRangeForm({ title, closeForm, getDateRange }) {
  const dispatch = useDispatch();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = async (data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (!startDate || !endDate) {
      if (!startDate) {
        setValue("startDate", "", { shouldDirty: true });
      }
      if (!endDate) {
        setValue("endDate", "", { shouldDirty: true });
      }
      return;
    }

    if (startDate > endDate) {
      dispatch(showNotification({ message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc", type: "warning" }));
      return;
    }

    // Kiểm tra nếu khoảng ngày lớn hơn 30 ngày
    const daysDifference = differenceInDays(endDate, startDate);
    if (daysDifference > 30) {
      dispatch(showNotification({ message: "Khoảng ngày không được lớn hơn 30 ngày", type: "warning" }));
      return;
    }
    
    // console.log("Ngày bắt đầu:", startDate.toISOString());
    // console.log("Ngày kết thúc:", endDate.toISOString());

    getDateRange(startDate.toISOString(), endDate.toISOString());
    reset();
    closeForm();
  };

  return (
    <div className={styles["dialog"]}>
      <div className={styles["dialog__content"]}>
        <h1>{title}</h1>
        <form className={styles["dialog__content__box"]} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles["dialog__content__box__control"]}>
            <label>Ngày bắt đầu:</label>
            <Controller
              name="startDate"
              control={control}
              defaultValue=""
              rules={{ required: "Ngày bắt đầu không được trống" }}
              render={({ field }) => (
                <>
                  <input type="date" onChange={(e) => field.onChange(e.target.value)} value={field.value || ""} />
                  {errors.startDate && (
                    <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>{errors.startDate.message}</span>
                  )}
                </>
              )}
            />
          </div>
          <div className={styles["dialog__content__box__control"]}>
            <label>Ngày kết thúc:</label>
            <Controller
              name="endDate"
              control={control}
              defaultValue=""
              rules={{ required: "Ngày kết thúc không được trống" }}
              render={({ field }) => (
                <>
                  <input type="date" onChange={(e) => field.onChange(e.target.value)} value={field.value || ""} />
                  {errors.endDate && (
                    <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>{errors.endDate.message}</span>
                  )}
                </>
              )}
            />
          </div>
          <div className={styles["dialog__content__box__actions"]}>
            <button
              onClick={() => {
                closeForm();
              }}
              className={styles["button"]}
            >
              Hủy
            </button>
            <button style={{ marginLeft: "auto" }} type="submit" className={styles["button"]}>
              Lọc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
