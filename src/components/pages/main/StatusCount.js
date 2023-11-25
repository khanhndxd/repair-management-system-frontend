"use client";

import {
  useGetRepairOrderByStatusQuery,
} from "@/services/api/repairOrder/repairOrderApi";

export default function StatusCount({ statusId }) {
  const { data, isLoading, isFetching, isError } = useGetRepairOrderByStatusQuery(statusId);

  if (isLoading || isFetching) return <span style={{ fontSize: "12px" }}>Đang tải...</span>;

  if (isError) return <span style={{ fontSize: "12px" }}>Xảy ra lỗi</span>;

  return <span>{data.data}</span>;
}
