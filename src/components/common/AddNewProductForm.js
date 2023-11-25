"use client";
import { useAddCustomerProductMutation } from "@/services/api/customerProduct/customerProductApi";
import { hideDialog } from "@/store/features/dialogSlice";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import styles from "@/styles/main.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function AddNewProductForm() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const repairOrder = useSelector((state) => state.repairOrder);
  const [addCustomerProduct, { loading: customerProductLoading }] = useAddCustomerProductMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = async (data) => {
    dispatch(showLoading({ content: "Đang tạo sản phẩm mới..." }));
    try {
      let payload = [{ CustomerId: repairOrder.customer.id, Name: data.name, Note: data.note }];
      await addCustomerProduct(payload);
    } catch (ex) {
      console.log(ex);
    }
    dispatch(hideLoading());
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
        <label htmlFor="name">Tên sản phẩm</label>
        <input type="text" id="name" {...register("name", { required: true })} />
        {errors.name && <span style={{ color: "#cc3300" }}>Không được để trống tên sản phẩm</span>}
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="note">Ghi chú</label>
        <textarea id="note" name="note" rows="10" cols="50" {...register("note")} />
      </div>
      <div className={styles["dialog__content__box__actions"]}>
        <button onClick={handleCloseForm} className={styles["button"]}>
          Hủy
        </button>
        <button style={{ marginLeft: "auto" }} type="submit" className={styles["button"]}>
          Thêm sản phẩm
        </button>
      </div>
    </form>
  );
}
