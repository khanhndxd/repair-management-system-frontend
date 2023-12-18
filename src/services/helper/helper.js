import { addDays, format, parseISO, startOfWeek, endOfWeek, getDaysInMonth, isWithinInterval } from "date-fns";
import viLocale from 'date-fns/locale/vi';

const repairTypes = ["Bảo hành", "Sửa chữa", "Đổi mới"];
const repairTasks = ["Vệ sinh máy tính", "Cài đặt phần mềm", "Sửa chữa phần mềm", "Thay thế linh kiện", "Đổi mới"];
const categories = [
  "Màn hình",
  "Nguồn máy tính",
  "Mainboard",
  "Chuột",
  "Bàn phím",
  "Thiết bị lưu trữ, bộ nhớ",
  "Tai nghe",
  "CPU",
  "VGA",
  "Tản nhiệt",
  "Ergonomic",
  "Webcam",
  "PC",
  "Thiết bị ngoại vi",
];
export const statuses = [
  { value: 1, label: "Chờ xử lý" },
  { value: 2, label: "Đã tiếp nhận" },
  { value: 3, label: "Đang sửa chữa" },
  { value: 4, label: "Đã chuyển sản phẩm về hãng" },
  { value: 5, label: "Đã nhận sản phẩm từ hãng" },
  { value: 6, label: "Đã sửa xong" },
  { value: 7, label: "Đã hủy" },
  { value: 8, label: "Đã hoàn thành" },
  { value: 9, label: "Đã trả hàng" },
];

export const getStatusLabelByValue = (value) => {
  const status = statuses.find((status) => status.value === value);
  return status ? status.label : "Không xác định";
};

export const roles = {
  admin: "Admin",
  staff: "Staff",
};

export function convertToVND(price) {
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return VND.format(price);
}

export function convertFromVND(formattedPrice) {
  // Loại bỏ ký tự đơn vị và dấu phân cách nếu có
  const numericString = formattedPrice.replace(/[^\d]/g, "");

  // Chuyển đổi thành số
  const numericValue = parseFloat(numericString);

  return numericValue;
}

export function isContainValueInArray(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return true;
    }
  }
  return false;
}

export function isContainValueInArrayOfObject(arr, prop, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][prop] === value) {
      return true;
    }
  }
  return false;
}

export function preprocessingChartData(data, type, timeRange, year) {
  let datasets = {};
  let totalUnits;
  let isArray = false;
  let nameToGet;
  let nameToAccess;
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  if (timeRange === "week") {
    totalUnits = 7; // Số ngày trong tuần
  } else if (timeRange === "current-month") {
    totalUnits = getDaysInMonth(new Date()); // Số ngày trong tháng
  } else if (timeRange === "months") {
    totalUnits = 12;
  } else {
    totalUnits = 12; // Số tháng trong năm (mặc định)
  }

  const units = Array.from({ length: totalUnits }, (_, index) => {
    if (timeRange === "week") {
      // Sử dụng 'eeee' để hiển thị tên đầy đủ của ngày trong tuần
      const day = addDays(weekStart, index);
      return format(day, "eeee", { locale: viLocale });
    } else {
      return (index + 1).toString();
    }
  });

  if (type === "repairTasks") {
    nameToAccess = "task";
    nameToGet = "name";
    isArray = true;
  } else if (type === "repairProducts") {
    nameToAccess = "purchasedProduct";
    nameToGet = "name";
    isArray = true;
  } else if (type === "repairReason") {
    nameToGet = "reason";
  } else if (type === "repairType") {
    nameToGet = "name";
  }

  datasets = getDatasets(year, data, type, nameToGet, nameToAccess, isArray, totalUnits, timeRange, weekStart, weekEnd);

  const chartData = {
    labels: units,
    datasets: Object.values(datasets),
  };

  return chartData;
}

function getDatasets(year, data, type, nameToGet, nameToAccess, isArray, totalUnits, timeRange, weekStart, weekEnd) {
  let datasets = getDefaultDatasetNames(type, totalUnits);
  // let datasets = {};

  let timeFormat;
  if (timeRange === "week") {
    timeFormat = "i"; // Ngày trong tuần (0 - 6)
  } else if (timeRange === "current-month") {
    timeFormat = "dd"; // Ngày trong tháng
  } else if (timeRange === "months") {
    timeFormat = "MM"; // Tháng trong năm
  } else {
    timeFormat = "MM"; // Tháng trong năm
  }

  for (let i = 0; i < data.length; i++) {
    const destination = data[i][type];
    const orderYear = format(parseISO(data[i].createdAt), "yyyy");

    if (orderYear === year) {
      if (isArray === true) {
        for (let j = 0; j < destination.length; j++) {
          const destinationItem = destination[j];
          let destinationItemName;
          if (type === "repairProducts") {
            destinationItemName = destinationItem[nameToAccess]["category"][nameToGet];
          } else {
            destinationItemName = destinationItem[nameToAccess][nameToGet];
          }

          const destinationItemTime = format(parseISO(data[i].createdAt), timeFormat);
          const key = `${destinationItemName}`;

          if (!datasets[key]) {
            datasets[key] = {
              label: destinationItemName,
              data: Array.from({ length: totalUnits }, (_, index) => 0),
              backgroundColor: getRandomColor(),
            };
          }

          if (timeRange === "week") {
            // Kiểm tra xem dữ liệu hiện tại có thuộc ngày trong tuần đó không
            const currentDataDate = parseISO(data[i].createdAt);
            if (isWithinInterval(currentDataDate, { start: weekStart, end: weekEnd })) {
              datasets[key].data[parseInt(destinationItemTime, 10) - 1]++;
            }
          } else {
            datasets[key].data[parseInt(destinationItemTime, 10) - 1]++;
          }
        }
      } else {
        const destinationName = destination[nameToGet];

        const destinationTime = format(parseISO(data[i].createdAt), timeFormat);
        const key = `${destinationName}`;

        if (!datasets[key]) {
          datasets[key] = {
            label: destinationName,
            data: Array.from({ length: totalUnits }, (_, index) => 0),
            backgroundColor: getRandomColor(),
          };
        }

        if (timeRange === "week") {
          // Kiểm tra xem dữ liệu hiện tại có thuộc ngày trong tuần đó không
          const currentDataDate = parseISO(data[i].createdAt);
          if (isWithinInterval(currentDataDate, { start: weekStart, end: weekEnd })) {
            datasets[key].data[parseInt(destinationTime, 10) - 1]++;
          }
        } else {
          datasets[key].data[parseInt(destinationTime, 10) - 1]++;
        }
      }
    }
  }
  return datasets;
}

export function getDefaultDatasetNames(type, totalUnits) {
  let datasets = {};
  if (type === "repairType") {
    for (let i = 0; i < repairTypes.length; i++) {
      datasets[repairTypes[i]] = {
        label: repairTypes[i],
        data: Array.from({ length: totalUnits }, (_, index) => 0),
        backgroundColor: getRandomColor(),
      };
    }
  } else if (type === "categories") {
    for (let i = 0; i < categories.length; i++) {
      datasets[categories[i]] = {
        label: categories[i],
        data: Array.from({ length: totalUnits }, (_, index) => 0),
        backgroundColor: getRandomColor(),
      };
    }
  } else if (type === "repairTasks") {
    for (let i = 0; i < repairTasks.length; i++) {
      datasets[repairTasks[i]] = {
        label: repairTasks[i],
        data: Array.from({ length: totalUnits }, (_, index) => 0),
        backgroundColor: getRandomColor(),
      };
    }
  }
  return datasets;
}

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
