import styles from "@/styles/main.module.scss";

export default function Loading(props) {
  return (
    <div className={styles["loading"]}>
      <div className={styles["loader"]} style={props.small === true ? { width: "20px", height: "20px" } : {}}></div>
      {/* <h4>Đang tải...</h4> */}
    </div>
  );
}
