"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";

export default function Providers(props) {
  return <Provider store={store}>{props.children}</Provider>;
}
