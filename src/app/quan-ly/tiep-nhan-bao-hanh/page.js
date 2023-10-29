"use client"
import styles from "@/styles/main.module.scss";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/features/notificationSlice";
import RepairOrderInfoForm from "@/components/pages/quan-ly/tiep-nhan-bao-hanh/RepairOrderInfoForm";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import CustomerForm from "@/components/pages/quan-ly/tiep-nhan-bao-hanh/CustomerForm";
import RepairList from "@/components/pages/quan-ly/tiep-nhan-bao-hanh/RepairList";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/loading";

export default function NewRepairOrder() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      creator: "123",
      receiver: "",
      "created-date": format(new Date(), "yyyy-MM-dd"),
      "received-date": format(new Date(), "yyyy-MM-dd"),
      "return-type": "",
      "repair-type": "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    dispatch(showNotification({ message: "Tạo phiếu thành công", type: "success" }));
    router.replace("/quan-ly/chi-tiet-don/1");
  };

  return (
    <div className={styles["dashboard__neworder"]}>
      <h1>Tạo phiếu bảo hành</h1>
      <form className={styles["dashboard__neworder__content"]} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles["dashboard_neworder__content__actions"]}>
          <button type="submit" className={styles["button"]}>
            Thêm mới
          </button>
        </div>
        <div className={styles["dashboard__neworder__content"]}>
          <div className={styles["dashboard__neworder__content__info"]}>
            <div className={styles["dashboard__neworder__content__info__box"]}>
              <h3>&#10112; Thông tin khách hàng</h3>
              <CustomerForm control={control} />
            </div>
            <div className={styles["dashboard__neworder__content__info__box"]}>
              <h3>&#10113; Thông tin đơn</h3>
              <Suspense fallback={<Loading />}>
                <RepairOrderInfoForm register={register} errors={errors} />
              </Suspense>
            </div>
          </div>
          <div className={styles["dashboard__neworder__content__product"]}>
            <h3>&#10114; Thông tin bảo hành</h3>
            <div className={styles["dashboard__neworder__content__product__actions"]}>
              <button className={styles["button-outline"]}>Chọn sản phẩm đã mua</button>
              <button className={styles["button-outline"]}>Tạo mới sản phẩm</button>
            </div>
            <RepairList />
            <p style={{ marginLeft: "auto" }}>
              Tổng chi phí: <strong style={{ fontSize: "24px" }}>999.999đ</strong>
            </p>
          </div>
          <div className={styles["dashboard__neworder__content__info"]}>
            <div className={styles["dashboard__neworder__content__info__box"]}>
              <h3>&#10115; Ghi chú</h3>
              <textarea
                id="ghi-chu"
                name="ghi-chu"
                rows="10"
                cols="50"
                placeholder="Nhập ghi chú"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
