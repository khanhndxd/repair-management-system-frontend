"use client";

import { useSelector } from "react-redux";
import styles from "@/styles/main.module.scss";

export default function LoadingAsync() {
  const loadingAsync = useSelector((state) => state.loadingAsync);

  return (
    <div className={loadingAsync.show === true ? styles["loading-async"] : styles["loading-async--hidden"]}>
      <div className={styles["loading-async__content"]}>
        <h1>{loadingAsync.content}</h1>
      </div>
    </div>
  );
}
