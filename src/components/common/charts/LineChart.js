"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export const options = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
      display: true,
    },
    title: {
      position: "top",
      display: true,
      text: "",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          // const label = context.label || "";
          // const value = context.formattedValue;
          // const dataset = context.dataset;
          // const data = dataset.data;
          // const total = data.reduce((acc, currentValue) => acc + currentValue, 0);
          // if (total !== 0) {
          //   const percentage = ((value / total) * 100).toFixed(2);
          //   return `${label}: ${value} (${percentage}%)`;
          // } else {
          //   return `${label}: ${value}`;
          // }
        },
      },
    },
  },
};

export default function LineChart({ chartData, chartTitle }) {
  options.plugins.title.text = chartTitle || options.plugins.title.text;
  return <Line data={chartData} options={options} />;
}
