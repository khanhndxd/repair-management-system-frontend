import { setConnection, setConnectionState } from "./signalrSlice";
import * as signalR from "@microsoft/signalr";

const signalRMiddleware = (store) => (next) => (action) => {
  if (action.type === "signalR/startConnection") {
    const { hubUrl, orderId, handleReceiveNotification } = action.payload;
    const { token } = store.getState().auth;
    const connection = new signalR.HubConnectionBuilder().withUrl(hubUrl).build();

    connection
      .start()
      .then(() => {
        store.dispatch(setConnection(connection));
        store.dispatch(setConnectionState("connected"));

        connection.invoke("JoinGroup", orderId);

        // Lắng nghe sự kiện từ Hub
        connection.on("receiveNotification", handleReceiveNotification);
      })
      .catch((error) => {
        console.error("Lỗi khi kết nối đến SignalR Hub:", error);
        store.dispatch(setConnectionState("disconnected"));
      });
  }

  if (action.type === "signalR/stopConnection") {
    const { connection } = store.getState().signalr;
    if (connection) {
      connection.stop();
      store.dispatch(setConnection(null));
      store.dispatch(setConnectionState("disconnected"));
    }
  }

  return next(action);
};

export default signalRMiddleware;
