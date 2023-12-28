import StatusBox from "@/components/pages/main/StatusBox";
import styles from "@/styles/main.module.scss";

export default function Home() {
  return (
    <main className={styles["dashboard__main"]}>
      <h1>Trang chủ</h1>
      <div className={styles["dashboard__main__content"]}>
        <p>Danh sách trạng thái đơn bảo hành</p>
        <div className={styles["dashboard__main__content__overview"]}>
          <StatusBox title={"Chờ xử lý"} statusId={1} />
          <StatusBox title={"Đã tiếp nhận"} statusId={2} />
          <StatusBox title={"Đang sửa chữa"} statusId={3} />
          <StatusBox title={"Đã chuyển sản phẩm về hãng"} statusId={4} />
          <StatusBox title={"Đã nhận sản phẩm từ hãng"} statusId={5} />
          <StatusBox title={"Đã sửa xong"} statusId={6} />
          <StatusBox title={"Đã hủy"} statusId={7} />
          <StatusBox title={"Đã hoàn thành"} statusId={8} />
          <StatusBox title={"Đã trả hàng"} statusId={9} />
        </div>
      </div>
    </main>
  );
}
