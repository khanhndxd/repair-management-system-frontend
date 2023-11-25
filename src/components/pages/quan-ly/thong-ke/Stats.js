import styles from "@/styles/main.module.scss";
import Chart from "./Chart";

export default function Stats({ title, type }) {
  return (
    <div className={styles["dashboard__stats__content__chart"]}>
      <h3>{title}</h3>
      <Chart type={type} />
    </div>
  );
}
