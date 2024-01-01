"use client";
import Loading from "@/app/loading";
import { useGetAllRepairOrdersWithQueryStringQuery } from "@/services/api/repairOrder/repairOrderApi";
import StackBar from "@/components/common/charts/StackBar";
import { useState } from "react";
import { getDefaultDatasetNames, getRandomColor } from "@/services/helper/helper";
import {
  startOfDay,
  endOfDay,
  addDays,
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  getDaysInMonth,
  isWithinInterval,
  isSameDay,
  differenceInDays,
} from "date-fns";
import viLocale from "date-fns/locale/vi";
import BarChart from "@/components/common/charts/BarChart";
import styles from "@/styles/main.module.scss";
import DateRangeForm from "./DateRangeForm";
import PieChart from "@/components/common/charts/PieChart";

export default function Chart({ type }) {
  const [isOpenDateRangeForm, setIsOpenDateRangeForm] = useState(false);
  const [dateRangeFormValue, setDateRangeFormValue] = useState({ startDate: "", endDate: "" });
  const [dateRange, setDateRange] = useState({ value: "", label: "" });
  const [repairType, setRepairType] = useState({ value: "", label: "" });
  const { data, isLoading, isFetching, isError } = useGetAllRepairOrdersWithQueryStringQuery({
    field: type,
    time: dateRange.value,
    startDate: dateRangeFormValue.startDate,
    endDate: dateRangeFormValue.endDate,
  });

  if (isError) return <div>Có lỗi xảy ra!</div>;

  if (isLoading || isFetching) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  let chart;
  if (type === "repairType") {
    chart = (
      <BarChart
        chartData={getRepairTypeChartData(data.data, dateRange.value, "2023", dateRangeFormValue.startDate, dateRangeFormValue.endDate)}
        chartTitle={`Số đơn trong ${dateRange.label}`}
      />
    );
  } else if (type === "category") {
    chart = (
      <StackBar
        chartData={getChartArrayData(
          data.data,
          "repairProducts",
          repairType.label,
          dateRange.value,
          "2023",
          dateRangeFormValue.startDate,
          dateRangeFormValue.endDate
        )}
        chartTitle={`Số sản phẩm trong ${dateRange.label} ${
          repairType.value !== "" ? `(Theo loại ${repairType.label})` : "(Theo tất cả loại sửa chữa)"
        }`}
      />
    );
  } else if (type === "repairTask") {
    chart = (
      <StackBar
        chartData={getChartArrayData(
          data.data,
          "repairTasks",
          repairType.label,
          dateRange.value,
          "2023",
          dateRangeFormValue.startDate,
          dateRangeFormValue.endDate
        )}
        chartTitle={`Số công việc trong ${dateRange.label} ${
          repairType.value !== "" ? `(Theo loại ${repairType.label})` : "(Theo tất cả loại sửa chữa)"
        }`}
      />
    );
  } else if (type === "totalprice") {
    chart = (
      <PieChart
        chartData={getTotalPriceChartData(
          data.data,
          repairType.label,
          dateRange.value,
          "2023",
          dateRangeFormValue.startDate,
          dateRangeFormValue.endDate
        )}
        chartTitle={`Tổng doanh thu trong ${dateRange.label}`}
      />
    );
  }

  const handleOpenDateRangeForm = () => {
    setIsOpenDateRangeForm(true);
  };

  const handleCloseDateRangeForm = () => {
    setIsOpenDateRangeForm(false);
  };

  const handleGetDateRange = (startDate, endDate) => {
    setDateRangeFormValue({ startDate: startDate, endDate: endDate });
    setDateRange({
      value: "range",
      label: `khoảng từ ${format(parseISO(startDate), "dd-MM-yyyy")} đến ${format(parseISO(endDate), "dd-MM-yyyy")}`,
    });
  };

  return (
    <>
      <select
        className={styles["dashboard__stats__content__chart__date-select"]}
        onChange={(e) => {
          if (e.target.value === "range") {
            handleOpenDateRangeForm();
          } else {
            setDateRange({
              value: e.target.value,
              label: e.target.options[e.target.selectedIndex].getAttribute("name"),
            });
          }
        }}
        name="date-range"
        defaultChecked={dateRange.value}
      >
        <option value="">Thống kê theo thời gian</option>
        <option name="ngày hiện tại" value="current-day">
          Ngày hiện tại
        </option>
        <option name="tuần hiện tại" value="current-week">
          Tuần hiện tại
        </option>
        <option name="tháng hiện tại" value="current-month">
          Tháng hiện tại
        </option>
        <option name="các tháng trong năm" value="months">
          Tháng trong năm
        </option>
        <option name="range" value="range">
          Khoảng thời gian
        </option>
      </select>
      {type !== "repairType" && type !== "totalprice" && (
        <select
          className={styles["dashboard__stats__content__chart__type-select"]}
          onChange={(e) => {
            setRepairType({
              value: e.target.value,
              label: e.target.options[e.target.selectedIndex].getAttribute("name"),
            });
          }}
          name="repair-type"
          defaultChecked={repairType.value}
        >
          <option value="">Chọn loại sửa chữa</option>
          <option name="bảo hành" value="warranty">
            Bảo hành
          </option>
          <option name="sửa chữa" value="fix">
            Sửa chữa
          </option>
          <option name="đổi mới" value="change">
            Đổi mới
          </option>
        </select>
      )}
      {dateRange.value !== "" ? <>{chart}</> : "Chưa chọn dữ liệu hiển thị"}
      {isOpenDateRangeForm && (
        <DateRangeForm title={"Chọn khoảng thời gian thống kê"} closeForm={handleCloseDateRangeForm} getDateRange={handleGetDateRange} />
      )}
    </>
  );
}

function getRepairTypeChartData(data, timeRange, year, startDate, endDate) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  let totalUnits;
  let timeFormat;
  let currentDate;

  if (timeRange === "current-week") {
    totalUnits = 7; // Số ngày trong tuần
    timeFormat = "i"; // Ngày trong tuần (0 - 6)
    currentDate = new Date();
  } else if (timeRange === "current-month") {
    totalUnits = getDaysInMonth(new Date()); // Số ngày trong tháng
    timeFormat = "dd"; // Ngày trong tháng
    currentDate = new Date();
  } else if (timeRange === "months") {
    totalUnits = 12;
    timeFormat = "MM"; // Tháng trong năm
    currentDate = new Date();
  } else if (timeRange === "current-day") {
    totalUnits = 1;
    timeFormat = "eeee"; // Tên của ngày trong tuần (ví dụ: "Thứ Năm")
    currentDate = new Date();
  } else if (timeRange === "range" && startDate !== "" && endDate !== "") {
    const daysInRange = differenceInDays(endOfDay(parseISO(endDate)), startOfDay(parseISO(startDate))) + 1;
    totalUnits = daysInRange;
    timeFormat = "dd/MM"; // Ngày trong khoảng
    currentDate = new Date(startDate); // Bắt đầu từ ngày bắt đầu khoảng
  } else {
    totalUnits = 12; // Số tháng trong năm (mặc định)
    timeFormat = "MM"; // Tháng trong năm
    currentDate = new Date();
  }

  let datasets = getDefaultDatasetNames("repairType", totalUnits);

  const units = Array.from({ length: totalUnits }, (_, index) => {
    if (timeRange === "current-week") {
      // Sử dụng 'eeee' để hiển thị tên đầy đủ của ngày trong tuần
      const day = addDays(weekStart, index);
      return format(day, "eeee", { locale: viLocale });
    } else if (timeRange === "range" && startDate !== "" && endDate !== "") {
      const day = addDays(startOfDay(parseISO(startDate)), index);
      return format(day, "dd/MM");
    } else {
      return timeRange === "current-day" ? format(currentDate, timeFormat, { locale: viLocale }) : (index + 1).toString();
    }
  });

  for (let i = 0; i < data.length; i++) {
    const repairTypeName = data[i]["repairType"]["name"];

    const repairTypeTime = format(parseISO(data[i].createdAt), timeFormat);
    const key = `${repairTypeName}`;

    if (!datasets[key]) {
      datasets[key] = {
        label: repairTypeName,
        data: Array.from({ length: totalUnits }, (_, index) => 0),
        backgroundColor: getRandomColor(),
      };
    }

    if (timeRange === "range" && startDate !== "" && endDate !== "") {
      const currentDataDate = parseISO(data[i].createdAt);
      const startRange = startOfDay(parseISO(startDate));
      const endRange = endOfDay(parseISO(endDate));
      // Kiểm tra xem dữ liệu hiện tại có thuộc trong khoảng ngày không
      if (isWithinInterval(currentDataDate, { start: startRange, end: endRange })) {
        datasets[key].data[units.indexOf(repairTypeTime)]++;
      }
    } else {
      if (timeRange === "current-week") {
        // Kiểm tra xem dữ liệu hiện tại có thuộc ngày trong tuần đó không
        const currentDataDate = parseISO(data[i].createdAt);
        if (isWithinInterval(currentDataDate, { start: weekStart, end: weekEnd })) {
          datasets[key].data[parseInt(repairTypeTime, 10) - 1]++;
        }
      } else if (timeRange === "current-day") {
        // Kiểm tra xem dữ liệu hiện tại có thuộc ngày hiện tại không
        const currentDataDate = parseISO(data[i].createdAt);
        if (isSameDay(currentDataDate, currentDate)) {
          datasets[key].data[0]++;
        }
      } else {
        datasets[key].data[parseInt(repairTypeTime, 10) - 1]++;
      }
    }
  }

  const chartData = {
    labels: units,
    datasets: Object.values(datasets),
  };

  return chartData;
}

function getChartArrayData(data, dataProp, repairTypeName, timeRange, year, startDate, endDate) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  let totalUnits;
  let timeFormat;
  let currentDate;

  if (timeRange === "current-week") {
    totalUnits = 7; // Số ngày trong tuần
    timeFormat = "i"; // Ngày trong tuần (0 - 6)
    currentDate = new Date();
  } else if (timeRange === "current-month") {
    totalUnits = getDaysInMonth(new Date()); // Số ngày trong tháng
    timeFormat = "dd"; // Ngày trong tháng
    currentDate = new Date();
  } else if (timeRange === "months") {
    totalUnits = 12;
    timeFormat = "MM"; // Tháng trong năm
    currentDate = new Date();
  } else if (timeRange === "current-day") {
    totalUnits = 1;
    timeFormat = "eeee"; // Tên của ngày trong tuần (ví dụ: "Thứ Năm")
    currentDate = new Date();
  } else if (timeRange === "range" && startDate !== "" && endDate !== "") {
    const daysInRange = differenceInDays(endOfDay(parseISO(endDate)), startOfDay(parseISO(startDate))) + 1;
    totalUnits = daysInRange;
    timeFormat = "dd/MM"; // Ngày trong khoảng
    currentDate = new Date(startDate); // Bắt đầu từ ngày bắt đầu khoảng
  } else {
    totalUnits = 12; // Số tháng trong năm (mặc định)
    timeFormat = "MM"; // Tháng trong năm
    currentDate = new Date();
  }

  let datasets;
  if (dataProp === "repairProducts") {
    datasets = getDefaultDatasetNames("categories", totalUnits);
  } else if (dataProp === "repairTasks") {
    datasets = getDefaultDatasetNames("repairTasks", totalUnits);
  }

  const units = Array.from({ length: totalUnits }, (_, index) => {
    if (timeRange === "current-week") {
      // Sử dụng 'eeee' để hiển thị tên đầy đủ của ngày trong tuần
      const day = addDays(weekStart, index);
      return format(day, "eeee", { locale: viLocale });
    } else if (timeRange === "range" && startDate !== "" && endDate !== "") {
      const day = addDays(startOfDay(parseISO(startDate)), index);
      return format(day, "dd/MM");
    } else {
      return timeRange === "current-day" ? format(currentDate, timeFormat, { locale: viLocale }) : (index + 1).toString();
    }
  });

  for (let i = 0; i < data.length; i++) {
    const innerData = data[i][dataProp];

    if (repairTypeName === "" || repairTypeName === null) {
      for (let j = 0; j < innerData.length; j++) {
        let dataName;
        if (dataProp === "repairProducts") {
          dataName = innerData[j]["purchasedProduct"]["category"]["name"];
        } else {
          dataName = innerData[j]["task"]["name"];
        }

        const dataTime = format(parseISO(data[i].createdAt), timeFormat);
        const key = `${dataName}`;

        if (!datasets[key]) {
          datasets[key] = {
            label: dataName,
            data: Array.from({ length: totalUnits }, (_, index) => 0),
            backgroundColor: getRandomColor(),
          };
        }
        if (timeRange === "range" && startDate !== "" && endDate !== "") {
          const currentDataDate = parseISO(data[i].createdAt);
          const startRange = startOfDay(parseISO(startDate));
          const endRange = endOfDay(parseISO(endDate));
          // Kiểm tra xem dữ liệu hiện tại có thuộc trong khoảng ngày không
          if (isWithinInterval(currentDataDate, { start: startRange, end: endRange })) {
            datasets[key].data[units.indexOf(dataTime)]++;
          }
        } else {
          if (timeRange === "current-week") {
            // Kiểm tra xem dữ liệu hiện tại có thuộc ngày trong tuần đó không
            const currentDataDate = parseISO(data[i].createdAt);
            if (isWithinInterval(currentDataDate, { start: weekStart, end: weekEnd })) {
              datasets[key].data[parseInt(dataTime, 10) - 1]++;
            }
          } else if (timeRange === "current-day") {
            // Kiểm tra xem dữ liệu hiện tại có thuộc ngày hiện tại không
            const currentDataDate = parseISO(data[i].createdAt);
            if (isSameDay(currentDataDate, currentDate)) {
              datasets[key].data[0]++;
            }
          } else {
            datasets[key].data[parseInt(dataTime, 10) - 1]++;
          }
        }
      }
    } else {
      if (data[i].repairType.name.toLowerCase() == repairTypeName.toLowerCase()) {
        for (let j = 0; j < innerData.length; j++) {
          let dataName;
          if (dataProp === "repairProducts") {
            dataName = innerData[j]["purchasedProduct"]["category"]["name"];
          } else {
            dataName = innerData[j]["task"]["name"];
          }

          const dataTime = format(parseISO(data[i].createdAt), timeFormat);
          const key = `${dataName}`;

          if (!datasets[key]) {
            datasets[key] = {
              label: dataName,
              data: Array.from({ length: totalUnits }, (_, index) => 0),
              backgroundColor: getRandomColor(),
            };
          }

          if (timeRange === "range" && startDate !== "" && endDate !== "") {
            const currentDataDate = parseISO(data[i].createdAt);
            const startRange = startOfDay(parseISO(startDate));
            const endRange = endOfDay(parseISO(endDate));
            // Kiểm tra xem dữ liệu hiện tại có thuộc trong khoảng ngày không
            if (isWithinInterval(currentDataDate, { start: startRange, end: endRange })) {
              datasets[key].data[units.indexOf(dataTime)]++;
            }
          } else {
            if (timeRange === "current-week") {
              // Kiểm tra xem dữ liệu hiện tại có thuộc ngày trong tuần đó không
              const currentDataDate = parseISO(data[i].createdAt);
              if (isWithinInterval(currentDataDate, { start: weekStart, end: weekEnd })) {
                datasets[key].data[parseInt(dataTime, 10) - 1]++;
              }
            } else if (timeRange === "current-day") {
              // Kiểm tra xem dữ liệu hiện tại có thuộc ngày hiện tại không
              const currentDataDate = parseISO(data[i].createdAt);
              if (isSameDay(currentDataDate, currentDate)) {
                datasets[key].data[0]++;
              }
            } else {
              datasets[key].data[parseInt(dataTime, 10) - 1]++;
            }
          }
        }
      }
    }
  }

  const chartData = {
    labels: units,
    datasets: Object.values(datasets),
  };

  return chartData;
}

function getTotalPriceChartData(data, repairTypeName, timeRange, year, startDate, endDate) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  let totalUnits;
  let timeFormat;
  let currentDate;

  if (timeRange === "current-week") {
    totalUnits = 7; // Số ngày trong tuần
    timeFormat = "i"; // Ngày trong tuần (0 - 6)
    currentDate = new Date();
  } else if (timeRange === "current-month") {
    totalUnits = getDaysInMonth(new Date()); // Số ngày trong tháng
    timeFormat = "dd"; // Ngày trong tháng
    currentDate = new Date();
  } else if (timeRange === "months") {
    totalUnits = 12;
    timeFormat = "MM"; // Tháng trong năm
    currentDate = new Date();
  } else if (timeRange === "current-day") {
    totalUnits = 1;
    timeFormat = "eeee"; // Tên của ngày trong tuần (ví dụ: "Thứ Năm")
    currentDate = new Date();
  } else if (timeRange === "range" && startDate !== "" && endDate !== "") {
    const daysInRange = differenceInDays(endOfDay(parseISO(endDate)), startOfDay(parseISO(startDate))) + 1;
    totalUnits = daysInRange;
    timeFormat = "dd/MM"; // Ngày trong khoảng
    currentDate = new Date(startDate); // Bắt đầu từ ngày bắt đầu khoảng
  } else {
    totalUnits = 12; // Số tháng trong năm (mặc định)
    timeFormat = "MM"; // Tháng trong năm
    currentDate = new Date();
  }

  let dataset = {
    data: [0, 0, 0],
    backgroundColor: [getRandomColor(), getRandomColor()],
    label: "Doanh thu",
  };

  let total = 0;
  for (let i = 0; i < data.length; i++) {
    const price = data[i]["totalPrice"];
    const repairType = data[i]["repairType"].name;

    // Kiểm tra điều kiện để xác định xem dữ liệu có nằm trong khoảng thời gian được chọn không
    if (timeRange === "current-week") {
      // Kiểm tra xem dữ liệu hiện tại có thuộc ngày trong tuần đó không
      const currentDataDate = parseISO(data[i].createdAt);
      if (isWithinInterval(currentDataDate, { start: weekStart, end: weekEnd })) {
        if (repairType.toLowerCase() === "Đổi mới".toLowerCase()) {
          total += price;
          dataset.data[0] += price;
          dataset.backgroundColor[0] = getRandomColor();
        } else if (repairType.toLowerCase() === "Sửa chữa".toLowerCase()) {
          total += price;
          dataset.data[1] += price;
          dataset.backgroundColor[1] = getRandomColor();
        } else if (repairType.toLowerCase() === "Bảo hành".toLowerCase()) {
          total += price;
          dataset.data[2] += price;
          dataset.backgroundColor[2] = getRandomColor();
        }
      }
    } else if (timeRange === "current-day") {
      // Kiểm tra xem dữ liệu hiện tại có thuộc ngày hiện tại không
      const currentDataDate = parseISO(data[i].createdAt);
      if (isSameDay(currentDataDate, currentDate)) {
        if (repairType.toLowerCase() === "Đổi mới".toLowerCase()) {
          total += price;
          dataset.data[0] += price;
          dataset.backgroundColor[0] = getRandomColor();
        } else if (repairType.toLowerCase() === "Sửa chữa".toLowerCase()) {
          total += price;
          dataset.data[1] += price;
          dataset.backgroundColor[1] = getRandomColor();
        } else if (repairType.toLowerCase() === "Bảo hành".toLowerCase()) {
          total += price;
          dataset.data[2] += price;
          dataset.backgroundColor[2] = getRandomColor();
        }
      }
    } else {
      if (repairType.toLowerCase() === "Đổi mới".toLowerCase()) {
        total += price;
        dataset.data[0] += price;
        dataset.backgroundColor[0] = getRandomColor();
      } else if (repairType.toLowerCase() === "Sửa chữa".toLowerCase()) {
        total += price;
        dataset.data[1] += price;
        dataset.backgroundColor[1] = getRandomColor();
      } else if (repairType.toLowerCase() === "Bảo hành".toLowerCase()) {
        total += price;
        dataset.data[2] += price;
        dataset.backgroundColor[2] = getRandomColor();
      }
    }
  }

  const chartData = {
    labels: ["Đổi mới", "Sửa chữa", "Bảo hành"],
    datasets: [dataset],
    total: total,
  };

  return chartData;
}
