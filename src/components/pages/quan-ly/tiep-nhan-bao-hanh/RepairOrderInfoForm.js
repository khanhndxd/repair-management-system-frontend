"use client";
import Loading from "@/app/loading";
import { useGetRepairDataQuery } from "@/services/api/repairData/repairDataApi";
import { addRepairType, addTask } from "@/store/features/repairOrderSlice";
import styles from "@/styles/main.module.scss";
import { useDispatch } from "react-redux";

export default function RepairOrderInfoForm(props) {
  const { data, isLoading, isFetching, isError } = useGetRepairDataQuery();
  const dispatch = useDispatch();
  const { register, errors } = props;

  if (isError) return <div>Có lỗi xảy ra!</div>;

  if (isLoading) return <Loading />;

  const handleTaskChange = (e) => {
    let task;
    if (data.tasks) {
      for (let i = 0; i < data.tasks.data.length; i++) {
        if (data.tasks.data[i].id === +e.target.value) {
          task = data.tasks.data[i];
          break;
        }
      }
    }
    dispatch(addTask({ object: task }));
  };

  const handleRepairTypeChange = (e) => {
    let repairType;
    if (data.repairTypes) {
      for (let i = 0; i < data.repairTypes.data.length; i++) {
        if (data.repairTypes.data[i].id === +e.target.value) {
          repairType = data.repairTypes.data[i];
          break;
        }
      }
    }
    dispatch(addRepairType({ object: repairType }));
  };

  return (
    <div className={styles["new-order-info"]}>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="creator">Người tạo phiếu</label>
        <input type="text" id="creator" {...register("creator")} />
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="receiver">Người tiếp nhận</label>
        <select id="receiver" {...register("receiver")}>
          <option value="1">Nguyễn Duy Khánh</option>
          <option value="2">Nguyễn Văn A</option>
        </select>
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="created-date">Ngày tiếp nhận</label>
        <input
          type="date"
          id="created-date"
          pattern="dd/mm/yyyy"
          {...register("created-date", { valueAsDate: true })}
        />
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="received-date">Ngày trả hàng (dự kiến)</label>
        <input
          type="date"
          id="received-date"
          pattern="dd/mm/yyyy"
          {...register("received-date", { valueAsDate: true })}
        />
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="return-type">Hình thức trả hàng</label>
        <input type="text" id="return-type" {...register("return-type")} />
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="repair-reason">Lý do bảo hành (*)</label>
        <select id="repair-reason" {...register("repair-reason", { required: true })}>
          {data?.repairReasons.data.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {item.reason}
              </option>
            );
          })}
        </select>
        {errors["repair-reason"] && (
          <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>
            Không được để trống lý do bảo hành
          </span>
        )}
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="repair-type">Loại sửa chữa (*)</label>
        <select
          id="repair-type"
          {...register("repair-type", { required: true, onChange: (e) => handleRepairTypeChange(e) })}
        >
          {data?.repairTypes.data.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            );
          })}
        </select>
        {errors["repair-type"] && (
          <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>
            Không được để trống loại sửa chữa
          </span>
        )}
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="task">Công việc (*)</label>
        <select id="task" {...register("task", { required: true, onChange: (e) => handleTaskChange(e) })}>
          {data?.tasks.data.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            );
          })}
        </select>
        {errors["task"] && (
          <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>
            Không được để trống công việc
          </span>
        )}
      </div>
    </div>
  );
}
