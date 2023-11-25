"use client";
import { useGetTotalPriceQuery } from "@/services/api/repairOrder/repairOrderApi";
import { convertToVND } from "@/services/helper/helper";

export default function Total() {
  const { data, isLoading, isFetching, isError } = useGetTotalPriceQuery();

  if (isLoading || isFetching) return <span style={{ fontSize: "12px" }}>Đang tải...</span>;

  if (isError) return <span style={{ fontSize: "12px" }}>Có lỗi xảy ra</span>;

  return <span>{convertToVND(data.data)}</span>;
}
