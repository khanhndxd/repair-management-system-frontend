"use client";
import styles from "@/styles/main.module.scss";

export default function DeleteConfirm({ id, title, content, handleDelete, handleOpen }) {
  return (
    <div className={styles["dialog"]}>
      <div className={styles["dialog__content"]}>
        <h1>{title}</h1>
        <div className={styles["dialog__content__box"]}>
          <p>{content}</p>
          <div className={styles["dialog__content__box__actions"]}>
            <button
              onClick={() => {
                handleOpen(false);
              }}
              className={styles["button"]}
            >
              Hủy
            </button>
            <button
              onClick={() => {
                handleDelete(id);
              }}
              style={{ marginLeft: "auto" }}
              type="button"
              className={styles["button"]}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
