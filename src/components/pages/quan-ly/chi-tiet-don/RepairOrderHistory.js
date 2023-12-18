"use client";
import Loading from "@/app/loading";
import { baseApi } from "@/services/api/baseApi";
import { useAddRepairLogMutation, useGetRepairLogByRepairOrderIdQuery } from "@/services/api/repairLog/repairLogApi";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import styles from "@/styles/main.module.scss";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startSignalRConnection, stopSignalRConnection } from "@/services/signalr/signalrActions";
import { format } from "date-fns";

export default function RepairOrderHistory({ repairOrderId }) {
  const { data, isLoading, isFetching, isError } = useGetRepairLogByRepairOrderIdQuery(repairOrderId);
  const [addRepairLog, { loading }] = useAddRepairLogMutation();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const messageRef = useRef(null);

  if (isError) return <div>Có lỗi xảy ra!</div>;

  useEffect(() => {
    const handleReceiveNotification = (notificationData) => {
      const { id } = notificationData;
      dispatch(
        baseApi.util.invalidateTags([
          { type: "RepairLogs", id },
        ])
      );
    };

    dispatch(
      startSignalRConnection({
        hubUrl: process.env.NEXT_PUBLIC_UPDATE_HUB_URL,
        orderId: repairOrderId,
        handleReceiveNotification,
      })
    );

    return () => {
      dispatch(stopSignalRConnection());
    };
  }, [repairOrderId]);

  if (isLoading || isFetching) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (messageRef.current.value.trim() === "") {
      dispatch(showNotification({ message: "Chưa nhập lời nhắn", type: "warning" }));
      return;
    }
    dispatch(showLoading({ content: "Đang gửi lời nhắn..." }));
    try {
      let payload = {
        RepairOrderId: repairOrderId,
        CreatedById: auth.userId,
        CreatedAt: new Date(),
        Info: messageRef.current.value,
      };
      messageRef.current.value = "";

      await addRepairLog(payload, { id: repairOrderId });
    } catch (err) {
      console.log(err);
    }
    dispatch(hideLoading());
  };

  return (
    <>
      <div className={styles["dashboard__orderdetail__content__history__messages"]}>
        {data.data?.map((item) => {
          let avatarNameSplitArr = (item?.createdBy?.userName || "").split(" ");
          let avatarName = avatarNameSplitArr[avatarNameSplitArr.length - 1].charAt(0);

          let displayTime;
          if (item?.createdAt) {
            displayTime = format(new Date(item.createdAt + "Z"), "dd-MM-yyyy HH:mm:ss");
          }
          return (
            <div key={item?.id} className={styles["dashboard__orderdetail__content__history__messages__message"]}>
              <div className={styles["dashboard__orderdetail__content__history__messages__message__avatar"]}>
                <h4>{avatarName}</h4>
              </div>
              <div className={styles["dashboard__orderdetail__content__history__messages__message__content"]}>
                <p>
                  <span style={{ fontWeight: "bold" }}>{item?.createdBy?.userName}</span> &nbsp; {displayTime}
                </p>
                <h5>{item?.info}</h5>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles["dashboard__orderdetail__content__history__create"]}>
        <textarea ref={messageRef} rows="5" placeholder="Nhập lời nhắn..." />
        <button className={styles["no-effect-button"]} onClick={handleSendMessage}>
          &#10148;
        </button>
      </div>
    </>
  );
}
