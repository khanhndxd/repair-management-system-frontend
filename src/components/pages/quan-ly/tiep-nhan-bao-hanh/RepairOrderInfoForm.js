"use client";
import Loading from "@/app/loading";
import MultipleTaskSelect from "@/components/common/MultipleTaskSelect";
import { useGetRepairDataQuery } from "@/services/api/repairData/repairDataApi";
import { useGetAllRepairReasonQuery } from "@/services/api/repairReason/repairReasonApi";
import { addRepairType, addTask, removeAllTasks, removeTask } from "@/store/features/repairOrderSlice";
import styles from "@/styles/main.module.scss";
import { useDispatch, useSelector } from "react-redux";

export default function RepairOrderInfoForm(props) {
  const { data, isLoading, isFetching, isError } = useGetRepairDataQuery();
  const { data: repairReason, isLoading: rrLoading, isFetching: rrFetching, isError: rrError } = useGetAllRepairReasonQuery();
  const dispatch = useDispatch();
  const { control, register, errors, setValue, watch } = props;
  const repairOrder = useSelector((state) => state.repairOrder);

  if (isError || rrError) return <div>Có lỗi xảy ra!</div>;

  if (isLoading || isFetching || rrLoading || rrFetching)
    return (
      <div>
        <Loading />
      </div>
    );

  const { receivers, technicians } = preprocessingUserData(data?.users);

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
    dispatch(removeAllTasks());
  };

  return (
    <>
      <div className={styles["new-order-info"]}>
        <div className={styles["new-order-info__control"]}>
          <label htmlFor="creator">Người tạo phiếu</label>
          <select disabled id="creator" {...register("creator", { required: true })}>
            {data?.users.data.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.userName}
                </option>
              );
            })}
          </select>
          {errors["creator"] && (
            <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>Không được để trống người tạo phiếu</span>
          )}
        </div>
        <div className={styles["new-order-info__control"]}>
          <label htmlFor="receiver">Người tiếp nhận</label>
          <select id="receiver" {...register("receiver", { required: true })}>
            {receivers?.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.userName}
                </option>
              );
            })}
          </select>
          {errors["receiver"] && (
            <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>Không được để trống người tiếp nhận</span>
          )}
        </div>
        <div className={styles["new-order-info__control"]}>
          <label htmlFor="technician">Kỹ thuật viên</label>
          <select id="technician" {...register("technician", { required: true })}>
            {technicians?.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.userName}
                </option>
              );
            })}
          </select>
          {errors["technician"] && (
            <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>Không được để trống kỹ thuật viên</span>
          )}
        </div>
        <div className={styles["new-order-info__control"]}>
          <label htmlFor="createdDate">Ngày tiếp nhận</label>
          <input disabled type="date" id="createdDate" pattern="dd/mm/yyyy" {...register("createdDate", { valueAsDate: true })} />
        </div>
        <div className={styles["new-order-info__control"]}>
          <label htmlFor="receiveDate">Ngày trả hàng (dự kiến)</label>
          <input type="date" id="receiveDate" pattern="dd/mm/yyyy" {...register("receiveDate", { valueAsDate: true })} />
        </div>
        <div className={styles["new-order-info__control"]}>
          <label htmlFor="receiveType">Hình thức trả hàng</label>
          <input type="text" id="receiveType" {...register("receiveType")} />
        </div>
        <div className={styles["new-order-info__control"]}>
          <label htmlFor="repairReason">Lý do bảo hành (*)</label>
          <select id="repairReason" {...register("repairReason", { required: true })}>
            {repairReason?.data.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.reason}
                </option>
              );
            })}
          </select>
          {errors["repairReason"] && (
            <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>Không được để trống lý do bảo hành</span>
          )}
        </div>
        <div className={styles["new-order-info__control"]}>
          <label htmlFor="repairType">Loại sửa chữa (*)</label>
          <select id="repairType" {...register("repairType", { required: true, onChange: (e) => handleRepairTypeChange(e) })}>
            {data?.repairTypes.data.map((item) => {
              return (
                <option key={item.id} value={item.id} disabled={isWarrantyCheck(item, repairOrder.products)}>
                  {item.name}
                </option>
              );
            })}
          </select>
          {errors["repairType"] && (
            <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>Không được để trống loại sửa chữa</span>
          )}
        </div>
      </div>
      <div className={styles["new-order-info__control"]}>
        <label htmlFor="task">Công việc (*)</label>
        <MultipleTaskSelect
          register={register}
          errors={errors}
          data={data?.tasks.data}
          setValue={setValue}
          watch={watch}
          name={"Tasks"}
          reduxDataStore={repairOrder.tasks}
          addToReduxStore={addTask}
          removeFromReduxStore={removeTask}
        />
      </div>
    </>
  );
}

const preprocessingUserData = (users) => {
  const receivers = [];
  const technicians = [];
  for (let i = 0; i < users?.data.length; i++) {
    for (let j = 0; j < users?.data[i]?.roles.length; j++) {
      if (users?.data[i]?.roles[j] === "Receiver") {
        receivers.push(users?.data[i]);
      } else if (users?.data[i]?.roles[j] === "Technician") {
        technicians.push(users?.data[i]);
      } else {
        continue;
      }
    }
  }
  return { receivers, technicians };
};

const isWarrantyCheck = (item, products) => {
  if (item.name.toLowerCase() === "Bảo hành".toLowerCase()) {
    if (products.length !== 0) {
      if (products[0].isWarrantyExpired === true) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};
