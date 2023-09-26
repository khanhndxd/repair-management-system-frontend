"use client";
import { useEffect, useState } from "react";
import styles from "@/styles/main.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { hideNotification } from "@/store/features/notificationSlice";

const symbols = {
  info: "\u2139",
  success: "\u2713",
  warning: "\u26A0",
  error: "\u26A0",
};

export default function Notification() {
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (notification.show === true) {
      setTimeout(() => {
        dispatch(hideNotification());
      }, notification.time);
    }
  }, [notification.show]);

  return (
    <>
      <div
        className={
          notification.show !== false
            ? styles[`notification--${notification.type}`]
            : styles["notification--hidden"]
        }
      >
        <span>{symbols[notification.type]}</span>
        <h5>{notification.message}</h5>
      </div>
    </>
  );
}
