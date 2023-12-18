"use client";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "@/styles/main.module.scss";
import { hideDialog } from "@/store/features/dialogSlice";
import { useAddCustomerMutation } from "@/services/api/customer/customerApi";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import { useGetAllRolesQuery, useUpdateUserMutation } from "@/services/api/user/userApi";
import Loading from "@/app/loading";
import { useRegisterMutation } from "@/services/api/auth/authApi";

export default function NewAccountForm() {
  const { data, isLoading, isFetching, isError } = useGetAllRolesQuery();
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const [createUser, { loading }] = useRegisterMutation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      roles: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    if (data["password"].length < 6) {
      dispatch(showNotification({ message: "Mật khẩu phải ít nhất 6 ký tự", type: "warning" }));
      return null;
    }
    if (
      !data["email"].match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      dispatch(showNotification({ message: "Sai định dạng email", type: "warning" }));
      return null;
    }
    dispatch(showLoading({ content: "Đang tạo người dùng..." }));
    try {
      await createUser({
        userName: data["name"],
        email: data["email"],
        phone: data["phone"],
        password: data["password"],
        role: data["roles"],
      }).unwrap();

      dispatch(hideLoading());
      dispatch(showNotification({ message: "Tạo người dùng thành công", type: "success" }));
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

  if (isError) return <div>Có lỗi xảy ra</div>;
  if (isLoading || isFetching) return <Loading />;

  return (
    <form
      className={dialog.show === true ? styles["dialog__content__box"] : styles["dialog__content__box--hidden"]}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="name">Tên (*)</label>
        <input type="text" id="name" {...register("name", { required: true })} />
        {errors["name"] && <span style={{ color: "#cc3300" }}>Không được để trống tên</span>}
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="email">Email (*)</label>
        <input type="text" id="email" {...register("email", { required: true })} />
        {errors["email"] && <span style={{ color: "#cc3300" }}>Không được để trống email</span>}
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="phone">Số điện thoại</label>
        <input type="text" id="phone" {...register("phone")} />
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="password">Mật khẩu (*)</label>
        <input type="password" id="password" {...register("password", { required: true })} />
        {errors["password"] && <span style={{ color: "#cc3300" }}>Không được để mật khẩu</span>}
      </div>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="roles">Danh sách vai trò (*)</label>
        <select id="roles" {...register("roles", { required: true })}>
          <option value="" disabled hidden>
            Chọn vai trò
          </option>
          {data?.data.map((item) => {
            let name = "";
            if (item.name === "Creator") {
              name = "Nhân viên tạo phiếu";
            } else if (item.name === "Receiver") {
              name = "Nhân viên tiếp nhận";
            } else if (item.name === "Technician") {
              name = "Kỹ thuật viên";
            } else {
              name = "Quản lý";
            }
            return (
              <option key={item.id} value={item.name}>
                {name}
              </option>
            );
          })}
        </select>
        {errors["roles"] && <span style={{ color: "#cc3300" }}>Chưa chọn vai trò</span>}
      </div>
      <div className={styles["dialog__content__box__actions"]}>
        <button onClick={handleCloseForm} className={styles["button"]}>
          Hủy
        </button>
        <button style={{ marginLeft: "auto" }} type="submit" className={styles["button"]}>
          Tạo mới
        </button>
      </div>
    </form>
  );
}
