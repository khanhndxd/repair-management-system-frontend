"use client";
import styles from "@/styles/main.module.scss";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/features/notificationSlice";
import { setCredentials } from "@/store/features/authSlice";
import { useLoginMutation } from "@/services/api/auth/authApi";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [login, { loading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "" },
  });

  const handleLogin = async (data) => {
    dispatch(showLoading({ content: "Đang đăng nhập..." }));
    await login({ email: data.username, password: data.password })
      .unwrap()
      .then((payload) => {
        dispatch(
          setCredentials({
            token: payload.data.token,
            refreshToken: payload.data.refreshToken,
          })
        );
        setIsSubmitSuccessful(true);
        router.push("/quan-ly");
        dispatch(hideLoading());
        dispatch(showNotification({ message: "Đăng nhập thành công", type: "success" }));
      })
      .catch((error) => {
        dispatch(hideLoading());
        dispatch(
          showNotification({
            message: `${error.data.message ? error.data.message : "Thông tin không hợp lệ"}`,
            type: "error",
          })
        );
        setIsSubmitSuccessful(false);
      });
  };

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <form onSubmit={handleSubmit(handleLogin)} noValidate>
      <div className={styles["box-login"]}>
        <h1>Đăng nhập</h1>
        <div className={styles["box-login__input"]}>
          <label htmlFor="username">
            <i>Tài khoản</i>
          </label>
          <input
            type="text"
            placeholder="Nhập email"
            id="username"
            {...register("username", { required: true })}
          />
          {errors["username"] && (
            <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>
              Chưa nhập tài khoản
            </span>
          )}
        </div>
        <div className={styles["box-login__input"]}>
          <label htmlFor="password">
            <i>Mật khẩu</i>
          </label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            id="password"
            {...register("password", { required: true })}
          />
          {errors["password"] && (
            <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>
              Chưa nhập mật khẩu
            </span>
          )}
        </div>
        <div className={styles["box-login__actions"]}>
          <button type="submit" className={styles["button"]}>
            Đăng nhập
          </button>
        </div>
      </div>
    </form>
  );
}
