import Stats from "@/components/pages/quan-ly/trang-chu/Stats";
import styles from "@/styles/main.module.scss";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles["dashboard__main"]}>
      <h1>Trang chủ</h1>
      <div className={styles["dashboard__main__content"]}>
        <h3>Thống kê</h3>
        <Stats />
        <h3>Danh sách trạng thái đơn bảo hành</h3>
        <div className={styles["dashboard__main__content__overview"]}>
          <div className={styles["dashboard__main__content__overview__box"]}>
            <h3>100</h3>
            <h4>Chờ xử lý</h4>
            <Link
              className={styles["button-outline"]}
              href={{
                pathname: "/quan-ly/bao-hanh-sua-chua",
                query: { status: 0 },
              }}
            >
              Xem danh sách
            </Link>
          </div>
          <div className={styles["dashboard__main__content__overview__box"]}>
            <h3>5</h3>
            <h4>Đã tiếp nhận</h4>
            <Link
              className={styles["button-outline"]}
              href={{
                pathname: "/quan-ly/bao-hanh-sua-chua",
                query: { status: 1 },
              }}
            >
              Xem danh sách
            </Link>
          </div>
          <div className={styles["dashboard__main__content__overview__box"]}>
            <h3>5</h3>
            <h4>Đang sửa chữa</h4>
            <Link
              className={styles["button-outline"]}
              href={{
                pathname: "/quan-ly/bao-hanh-sua-chua",
                query: { status: 1 },
              }}
            >
              Xem danh sách
            </Link>
          </div>
          <div className={styles["dashboard__main__content__overview__box"]}>
            <h3>5</h3>
            <h4>Đã chuyển sản phẩm về hãng</h4>
            <Link
              className={styles["button-outline"]}
              href={{
                pathname: "/quan-ly/bao-hanh-sua-chua",
                query: { status: 2 },
              }}
            >
              Xem danh sách
            </Link>
          </div>
          <div className={styles["dashboard__main__content__overview__box"]}>
            <h3>50</h3>
            <h4>Đã sửa xong</h4>
            <Link
              className={styles["button-outline"]}
              href={{
                pathname: "/quan-ly/bao-hanh-sua-chua",
                query: { status: 2 },
              }}
            >
              Xem danh sách
            </Link>
          </div>
          <div className={styles["dashboard__main__content__overview__box"]}>
            <h3>50</h3>
            <h4>Đã nhận sản phẩm từ hãng</h4>
            <Link
              className={styles["button-outline"]}
              href={{
                pathname: "/quan-ly/bao-hanh-sua-chua",
                query: { status: 3 },
              }}
            >
              Xem danh sách
            </Link>
          </div>
          <div className={styles["dashboard__main__content__overview__box"]}>
            <h3>9</h3>
            <h4>Đã hủy</h4>
            <Link
              className={styles["button-outline"]}
              href={{
                pathname: "/quan-ly/bao-hanh-sua-chua",
                query: { status: 5 },
              }}
            >
              Xem danh sách
            </Link>
          </div>
          <div className={styles["dashboard__main__content__overview__box"]}>
            <h3>9</h3>
            <h4>Đã hoàn thành</h4>
            <Link
              className={styles["button-outline"]}
              href={{
                pathname: "/quan-ly/bao-hanh-sua-chua",
                query: { status: 5 },
              }}
            >
              Xem danh sách
            </Link>
          </div>
          <div className={styles["dashboard__main__content__overview__box"]}>
            <h3>9</h3>
            <h4>Đã trả hàng</h4>
            <Link
              className={styles["button-outline"]}
              href={{
                pathname: "/quan-ly/bao-hanh-sua-chua",
                query: { status: 5 },
              }}
            >
              Xem danh sách
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
