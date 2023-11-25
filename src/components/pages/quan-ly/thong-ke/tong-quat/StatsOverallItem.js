import styles from "@/styles/main.module.scss";
import RepairOrderCount from "./RepairOrderCount";
import Total from "./Total";

export default function StatsOverallItem({ title, content, info }) {
  if (content === "count") {
    content = <RepairOrderCount info={info} />;
  } else if (content === "total") {
    content = <Total />;
  }

  return (
    <div className={styles["dashboard__stats__overall__box"]}>
      <p>{title}</p>
      <h3>{content}</h3>
    </div>
  );
}
