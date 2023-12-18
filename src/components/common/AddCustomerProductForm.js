"use client";
import Loading from "@/app/loading";
import { hideDialog } from "@/store/features/dialogSlice";
import { showNotification } from "@/store/features/notificationSlice";
import { addNewRepairProduct, addProduct } from "@/store/features/repairOrderSlice";
import styles from "@/styles/main.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useGetCustomerProductsByCustomerIdQuery } from "@/services/api/customerProduct/customerProductApi";

export default function AddCustomerProductForm() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const repairOrder = useSelector((state) => state.repairOrder);
  const { currentData, isLoading, isFetching, isError, error } = useGetCustomerProductsByCustomerIdQuery(repairOrder.customer.id);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { "customer-product": "" } });

  const handleCloseForm = () => {
    dispatch(hideDialog());
  };

  if (isError) {
    if (error.status === 404) {
      return (
        <div>
          Không có sản phẩm nào của khách hàng, hãy tạo mới sản phẩm! &nbsp;
          <button onClick={handleCloseForm} className={styles["no-effect-button"]} style={{ color: "blue" }}>
            <h3>Quay lại</h3>
          </button>
        </div>
      );
    }
    return <div>Có lỗi xảy ra!</div>;
  }

  if (isLoading) return <Loading />;

  const onSubmit = (data) => {
    let customerProduct;
    for (let i = 0; i < currentData.data.length; i++) {
      if (currentData.data[i].id === +data["customer-product"]) {
        customerProduct = currentData.data[i];
        break;
      }
    }
    dispatch(addNewRepairProduct({ object: customerProduct }));
    dispatch(showNotification({ message: "Chọn sản phẩm thành công", type: "success" }));
    dispatch(hideDialog());
  };

  return (
    <form
      className={dialog.show === true ? styles["dialog__content__box"] : styles["dialog__content__box--hidden"]}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="customer-product">Danh sách sản phẩm</label>
        <select id="customer-product" {...register("customer-product", { required: true })}>
          <option value="" disabled hidden>
            Chọn sản phẩm của khách hàng
          </option>
          {currentData?.data.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {item.name} | {item.note}
              </option>
            );
          })}
        </select>
        {errors["customer-product"] && <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>Chưa chọn sản phẩm</span>}
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
