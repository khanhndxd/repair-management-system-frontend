"use client";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "@/styles/main.module.scss";
import { hideDialog } from "@/store/features/dialogSlice";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import { useChangeRoleMutation, useGetAllRolesQuery } from "@/services/api/user/userApi";
import Loading from "@/app/loading";

export default function ChangeRoleForm() {
  const { data, isLoading, isFetching, isError } = useGetAllRolesQuery();
  const [changeRole, { loading }] = useChangeRoleMutation();
  const dialog = useSelector((state) => state.dialog);
  const dispatch = useDispatch();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { roles: "" } });

  const onSubmit = async (data) => {
    dispatch(showLoading({ content: "Đang đổi vai trò..." }));
    try {
      await changeRole({
        userId: dialog.info.id,
        newRole: data["roles"],
      }).unwrap();
      dispatch(hideLoading());
      dispatch(showNotification({ message: "Đổi vai trò thành công", type: "success" }));
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
      <h5>
        Vai trò hiện tại:{" "}
        {dialog.info.role === "Creator"
          ? "Nhân viên tạo phiếu"
          : dialog.info.role === "Receiver"
          ? "Nhân viên tiếp nhận"
          : dialog.info.role === "Technician"
          ? "Kỹ thuật viên"
          : dialog.info.role === "Admin"
          ? "Quản lý"
          : "Không có"}
      </h5>
      <div className={styles["dialog__content__box__control"]}>
        <label htmlFor="roles">Danh sách vai trò</label>
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
          Thay đổi
        </button>
      </div>
    </form>
  );
}
