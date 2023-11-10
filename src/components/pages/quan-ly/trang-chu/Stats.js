import styles from "@/styles/main.module.scss";
import Charts from "./Charts";
import ChartConfig from "./ChartConfig";

export default function Stats() {
  return (
    <div className={styles["dashboard__main__content__stats"]}>
      <div className={styles["dashboard__main__content__stats__chart"]}>
        <h3>Biểu đồ</h3>
        <Charts />
      </div>
      <div className={styles["dashboard__main__content__stats__info"]}>
        <h3>Tùy chọn thông số</h3>
        <ChartConfig />
      </div>
    </div>
  );
}
