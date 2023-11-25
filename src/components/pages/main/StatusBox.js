import styles from "@/styles/main.module.scss";
import Link from "next/link";
import dynamic from "next/dynamic";

const StatusCount = dynamic(() => import("@/components/pages/main/StatusCount"));

export default function StatusBox({ title, statusId }) {
  return (
    <div className={styles["dashboard__main__content__overview__box"]}>
      <h3>
        <StatusCount statusId={statusId} />
      </h3>
      <h4>{title}</h4>
      <Link
        className={styles["button-outline"]}
        href={{
          pathname: "/quan-ly/bao-hanh-sua-chua",
          query: { status: statusId },
        }}
      >
        Xem danh sách
      </Link>
    </div>
  );
}
