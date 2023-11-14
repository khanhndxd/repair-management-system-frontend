"use client";

import Loading from "@/app/loading";
import BarChart from "@/components/common/charts/BarChart";
import PieChart from "@/components/common/charts/PieChart";
import { useGetAllRepairOrdersQuery } from "@/services/api/repairOrder/repairOrderApi";
import { useSearchParams } from "next/navigation";

const types = {
  "loai-sua-chua": { name: "repairType", dataToGet: "name", title: "Loại sửa chữa" },
  "ly-do-sua-chua": { name: "repairReason", dataToGet: "reason", title: "Lý do sửa chữa" },
  "cong-viec": { name: "task", dataToGet: "name", title: "Công việc" },
};

export default function Charts(props) {
  const searchParams = useSearchParams();
  const { data, isLoading, isFetching, isError } = useGetAllRepairOrdersQuery();

  if (isError) return <div>Có lỗi xảy ra!</div>;
  if (isLoading || isFetching) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  if (searchParams.get("loai") !== null) {
    if (searchParams.get("loai") === "bar") {
        const title = searchParams.get("thongke") !== null ? types[searchParams.get("thongke")].title : "Loại sửa chữa";
      return (
        <BarChart
          chartData={preprocessingData(data.data, searchParams.get("thongke") || "loai-sua-chua")}
          chartTitle={`Biểu đồ cột (${title})`}
        />
      );
    } else if (searchParams.get("loai") === "pie") {
      const title = searchParams.get("thongke") !== null ? types[searchParams.get("thongke")].title : "Loại sửa chữa";
      return (
        <PieChart
          chartData={preprocessingData(data.data, searchParams.get("thongke") || "loai-sua-chua")}
          chartTitle={`Biểu đồ tròn (${title})`}
        />
      );
    }
  }
  return <div>Chưa chọn loại biểu đồ</div>;
}

const preprocessingData = (data, type) => {
  const statistics = {};
  const colors = {};
  const datasets = [];

  // Lặp qua mỗi đơn hàng sửa chữa
  for (let i = 0; i < data.length; i++) {
    const statsType = data[i][types[type].name][types[type].dataToGet];
    // Kiểm tra xem statsType đã tồn tại trong statistics chưa
    if (!statistics[statsType]) {
      statistics[statsType] = 0; // Số lượng đơn hàng theo statsType
      colors[statsType] = getRandomColor(); // Màu sắc ngẫu nhiên cho từng statsType
    }

    // Tăng số lượng
    statistics[statsType]++;
  }
  datasets.push({
    label: "",
    data: Object.keys(statistics).map((item) => {
      return statistics[item];
    }),
    backgroundColor: Object.keys(statistics).map((item) => getRandomColor()),
  });

  // Chuyển định dạng dữ liệu để phù hợp với biểu đồ
  const chartData = {
    labels: Object.keys(statistics),
    datasets: datasets,
  };

  return chartData;
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
