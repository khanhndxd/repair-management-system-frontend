"use client";
import Loading from "@/app/loading";
import { useGetWarrantyPolicyTasksByPolicyIdQuery } from "@/services/api/warrantyPolicyTask/warrantyPolicyTaskApi";
import { addTask } from "@/store/features/repairOrderSlice";
import styles from "@/styles/main.module.scss";
import { useDispatch, useSelector } from "react-redux";

export default function ApplyWarrantyPolicy({ handleOpen, policyId }) {
  const { data, isLoading, isfetching, isError } = useGetWarrantyPolicyTasksByPolicyIdQuery(policyId ? policyId : -1);
  const repairOrderTasks = useSelector((state) => state.repairOrder.tasks);
  const dispatch = useDispatch();
  if (isError) return <div>Có lỗi xảy ra</div>;

  if (isLoading || isfetching) return <Loading />;

  const handleClose = () => {
    handleOpen(false);
  };

  const handleAddTask = (data) => {
    dispatch(addTask({ object: data }));
  };

  return (
    <div className={styles["dialog"]}>
      <div className={styles["dialog__content"]}>
        <h1>{data.data[0].warrantyPolicy.description}</h1>
        <div className={styles["dialog__content__box"]}>
          <p style={{ fontStyle: "italic" }}>Danh sách các công việc của chính sách bảo hành</p>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px", flexWrap: "wrap", maxHeight: "200px", overflowY: "auto" }}>
            {data.data.map((item) => {
              const isDuplicateId = repairOrderTasks.some((task) => task.id === item.task.id);
              return (
                <span
                  key={item.id}
                  onClick={() => {
                    handleAddTask(item.task);
                  }}
                  className={isDuplicateId === false ? styles["button"] : styles["button--disabled"]}
                  style={{ backgroundColor: "orange", fontSize: "11px" }}
                >
                  {item.task.name}
                </span>
              );
            })}
          </div>
        </div>
        <div className={styles["dialog__content__box__actions"]}>
          <button onClick={handleClose} type="button" className={styles["button"]} style={{ marginLeft: "auto" }}>
            Hoàn thành
          </button>
        </div>
      </div>
    </div>
  );
}
