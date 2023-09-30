import styles from "@/styles/main.module.scss";

export default function Home() {
  return (
    <main className={styles["dashboard__main"]}>
      <h1>Tổng quan</h1>
      <div className={styles["dashboard__main__content"]}>
        <p>Danh sách trạng thái các đơn bảo hành</p>
        <div className={styles["dashboard__main__content__overview"]}>
          <div className={styles["dashboard__main__content__overview__box--1"]}>
            <h3>100</h3>
            <h4>Chờ xử lý</h4>
            <button className={styles["button-outline"]}>Xem danh sách</button>
          </div>
          <div className={styles["dashboard__main__content__overview__box--2"]}>
            <h3>5</h3>
            <h4>Đang sửa chữa</h4>
            <button className={styles["button-outline"]}>Xem danh sách</button>
          </div>
          <div className={styles["dashboard__main__content__overview__box--3"]}>
            <h3>50</h3>
            <h4>Đã sửa xong</h4>
            <button className={styles["button-outline"]}>Xem danh sách</button>
          </div>
          <div className={styles["dashboard__main__content__overview__box--4"]}>
            <h3>50</h3>
            <h4>Đã hủy</h4>
            <button className={styles["button-outline"]}>Xem danh sách</button>
          </div>
          <div className={styles["dashboard__main__content__overview__box--5"]}>
            <h3>9</h3>
            <h4>Đã trả hàng</h4>
            <button className={styles["button-outline"]}>Xem danh sách</button>
          </div>
          <div className={styles["dashboard__main__content__overview__box--5"]}>
            <h3>9</h3>
            <h4>Đã hoàn thành</h4>
            <button className={styles["button-outline"]}>Xem danh sách</button>
          </div>
        </div>
      </div>
    </main>
  );
}
