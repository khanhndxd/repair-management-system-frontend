"use client";
import { useGetRepairOrderByStatusQuery } from "@/services/api/repairOrder/repairOrderApi";

export default function RepairOrderCount({ info }) {
  const { data, isLoading, isFetching, isError } = useGetRepairOrderByStatusQuery(info.statusId);

  if (isLoading || isFetching) return <span style={{ fontSize: "12px" }}>Đang tải...</span>;

  if (isError) return <span style={{ fontSize: "12px" }}>Có lỗi xảy ra</span>;

  let content;
  if (info.statusId === -1) {
    content = <>{data.data} đơn</>;
  } else {
    content = (
      <>
        <RepairOrderPercent count={data.data} /> ({data.data} đơn)
      </>
    );
  }

  return <span>{content}</span>;
}

const RepairOrderPercent = ({ count }) => {
  const { data, isLoading, isFetching, isError } = useGetRepairOrderByStatusQuery(-1);
  if (isLoading || isFetching) return <span style={{ fontSize: "12px" }}>Đang tải...</span>;

  if (isError) return <span style={{ fontSize: "12px" }}>Có lỗi xảy ra</span>;

  return <span>{((count / data.data) * 100).toFixed(2)}%</span>;
};
