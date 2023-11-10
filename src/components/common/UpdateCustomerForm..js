"use client";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "@/styles/main.module.scss";
import { hideDialog } from "@/store/features/dialogSlice";
import { useGetCustomerByIdQuery, useUpdateCustomerMutation } from "@/services/api/customer/customerApi";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";

export default function UpdateCustomerForm() {
  const dispatch = useDispatch();
  const params = useParams();
  const [updateCustomer, { loading }] = useUpdateCustomerMutation();
  const { data: customer, isLoading, isFetching, isError } = useGetCustomerByIdQuery(params.id);
  const dialog = useSelector((state) => state.dialog);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: customer?.data.name,
      address: customer?.data.address,
      phone: customer?.data.phone,
      email: customer?.data.email,
      note: customer?.data.note,
    },
  });

  const onSubmit = async (data) => {
    try {
      dispatch(showLoading({ content: "Đang cập nhật thông tin khách hàng" }));
      const payload = {
        Id: customer.data.id,
        Name: data.name,
        Address: data.address,
        Phone: data.phone,
        Email: data.email,
        Note: data.note,
      };
      const result = await updateCustomer(payload);
      dispatch(showLoading({ content: result.data.message }));
    } catch (err) {
      console.log(err);
    }
    dispatch(hideLoading());
    dispatch(hideDialog());
  };

  const handleCloseForm = () => {
    dispatch(hideDialog());
  };

  if (isError) return <div>Có lỗi xảy ra!</div>;

  if (isLoading || isFetching) return <Loading />;

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
        <label htmlFor="note">Ghi chú</label>
        <textarea id="note" name="note" rows="10" cols="50" {...register("note")} />
      </div>
      <div className={styles["dialog__content__box__actions"]}>
        <button onClick={handleCloseForm} className={styles["button"]}>
          Hủy
        </button>
        <button style={{ marginLeft: "auto" }} type="submit" className={styles["button"]}>
          Xác nhận chỉnh sửa
        </button>
      </div>
    </form>
  );
}
