"use client";
import { convertFromVND, convertToVND } from "@/services/helper/helper";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        generateLabels: (chart) => {
          const data = chart.data.datasets[0].data;
          const total = data.reduce((acc, value) => acc + value, 0);

          return data.map((value, index) => ({
            text: `${chart.data.labels[index]}: ${convertToVND(value)} (${((value / total) * 100).toFixed(2)}%)`,
            fillStyle: chart.data.datasets[0].backgroundColor[index],
          }));
        },
      },
    },
    title: {
      position: "top",
      display: true,
      text: "",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || "";
          const value = convertFromVND(context.formattedValue);
          const dataset = context.dataset;
          const data = dataset.data;
          const total = data.reduce((acc, currentValue) => acc + currentValue, 0);
          if (total !== 0) {
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          } else {
            return `${label}: ${value}`;
          }
        },
      },
    },
    center_text: {
      text: 0,
    },
  },
};

const customPlugin = {
  id: "center_text",
  beforeDraw: (chart, args, options) => {
    const ctx = chart.ctx;
    const xCoor = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
    const yCoor = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
    ctx.save();

    ctx.font = "54px";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (options.text === 0) {
      ctx.fillText(`Không có doanh thu trong khoảng thời gian này`, xCoor, yCoor);
    } else {
      ctx.fillText(`${convertToVND(options.text)}`, xCoor, yCoor);
    }
    ctx.restore();
  },
};

export default function PieChart({ chartData, chartTitle }) {
  options.plugins.title.text = chartTitle || options.plugins.title.text;
  options.plugins.center_text.text = chartData.total;
  return <Doughnut data={chartData} options={options} plugins={[customPlugin]} />;
}
