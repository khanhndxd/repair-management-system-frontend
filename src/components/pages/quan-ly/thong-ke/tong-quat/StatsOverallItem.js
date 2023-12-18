import styles from "@/styles/main.module.scss";
import RepairOrderCount from "./RepairOrderCount";
import Total from "./Total";

export default function StatsOverallItem({ title, content, info }) {
  let component;
  if (content === "count") {
    component = <RepairOrderCount info={info} />;
  } else if (content === "total") {
    component = <Total />;
  }

  return (
    <div className={styles["dashboard__stats__overall__box"]}>
      <p>{title}</p>
      <h3>{component}</h3>
    </div>
  );
}
