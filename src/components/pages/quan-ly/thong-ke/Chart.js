"use client";

import Loading from "@/app/loading";
import { useGetAllRepairOrdersWithQueryStringQuery } from "@/services/api/repairOrder/repairOrderApi";
import LineChart from "@/components/common/charts/LineChart";
import StackBar from "@/components/common/charts/StackBar";
import { useState } from "react";
import { preprocessingChartData } from "@/services/helper/helper";

export default function Chart({ type }) {
  const [dateRange, setDateRange] = useState({ value: "", label: "" });
  const { data, isLoading, isFetching, isError } = useGetAllRepairOrdersWithQueryStringQuery({ field: type });
  let chart;

  if (isError) return <div>Có lỗi xảy ra!</div>;
  if (isLoading || isFetching) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (type !== "repairTasks" && type !== "repairProducts") {
    chart = (
      <LineChart
        chartData={preprocessingChartData(data.data, type, dateRange.value, "2023")}
        chartTitle={`Biểu đồ đường (Theo ${dateRange.label})`}
      />
    );
  } else {
    chart = (
      <StackBar
        chartData={preprocessingChartData(data.data, type, dateRange.value, "2023")}
        chartTitle={`Biểu đồ cột stacked (Theo ${dateRange.label})`}
      />
    );
  }

  return (
    <>
      <select
        onChange={(e) => {
          setDateRange({
            value: e.target.value,
            label: e.target.options[e.target.selectedIndex].getAttribute("name"),
          });
        }}
        name="date-range"
        defaultChecked={dateRange.value}
      >
        <option value="">Thống kê theo thời gian</option>
        <option name="tuần hiện tại" value="week">
          Tuần hiện tại
        </option>
        <option name="tháng hiện tại" value="current-month">
          Tháng hiện tại
        </option>
        <option name="các tháng trong năm" value="months">
          Tháng trong năm
        </option>
      </select>
      {dateRange.value !== "" ? <>{chart}</> : "Chọn thống kê theo thời gian"}
    </>
  );
}
