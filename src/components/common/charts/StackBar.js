"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      suggestedMax: 1.1,
      stacked: true,
      ticks: {
        stepSize: 1,
        callback: (value) => {
          return `${value} sản phẩm`;
        },
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
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
        },
      },
    },
  },
};

export default function StackBar({ chartData, chartTitle }) {
  options.plugins.title.text = chartTitle || options.plugins.title.text;
  return (
    <div style={{ width: "80%", height: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
