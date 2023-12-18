import Chart from "@/components/pages/quan-ly/thong-ke/Chart";
import TopCategories from "@/components/pages/quan-ly/thong-ke/TopCategories";
import StatsOverall from "@/components/pages/quan-ly/thong-ke/tong-quat/StatsOverall";
import styles from "@/styles/main.module.scss";

export default function StatsPage() {
  return (
    <div className={styles["dashboard__stats"]}>
      <h1>Thống kê</h1>
      <div className={styles["dashboard__stats__overall"]}>
        <StatsOverall />
      </div>
      <div className={styles["dashboard__stats__content"]}>
        <div className={styles["dashboard__stats__content__chart"]} style={{ gridColumn: "1 / 6", gridRow: "1 / 2" }}>
          <h3>Loại sửa chữa</h3>
          <Chart type={"repairType"} />
        </div>
        <div className={styles["dashboard__stats__content__chart"]} style={{ gridColumn: "1 / 9", gridRow: "2 / 3" }}>
          <h3>Nhóm linh kiện</h3>
          <Chart type={"category"} />
        </div>
        <div className={styles["dashboard__stats__content__chart"]} style={{ gridColumn: "6 / 9", gridRow: "1 / 2", }}>
          <h3>Doanh thu</h3>
          <Chart type={"totalprice"} />
        </div>
      </div>
      <h3>Top các nhóm linh kiện</h3>
      <TopCategories />
    </div>
  );
}
