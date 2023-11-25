import Stats from "@/components/pages/quan-ly/thong-ke/Stats";
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
        <Stats title={"Loại sản phẩm"} type={"repairProducts"}/>
        <Stats title={"Công việc"} type={"repairTasks"}/>
        <Stats title={"Loại bảo hành"} type={"repairType"}/>
      </div>
    </div>
  );
}
