"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
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
          const value = context.formattedValue;
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
  },
};

export default function BarChart({ chartData, chartTitle }) {
  options.plugins.title.text = chartTitle || options.plugins.title.text;
  return <Bar data={chartData} options={options} />;
}
