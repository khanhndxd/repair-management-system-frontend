"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ChartConfig(props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleChangeOption = (e) => {
    if (searchParams.get("loai") !== null) {
      router.replace(`${pathname}?thongke=${e.target.value}&loai=${searchParams.get("loai")}`);
    } else {
      router.replace(`${pathname}?thongke=${e.target.value}`);
    }
  };
  const handleChartType = (e) => {
    if (searchParams.get("thongke") !== null) {
      router.replace(`${pathname}?thongke=${searchParams.get("thongke")}&loai=${e.target.value}`);
    } else {
      router.replace(`${pathname}?loai=${e.target.value}`);
    }
  };

  return (
    <>
      {/* <select name="chart-options" onChange={(e) => handleChangeOption(e)}>
        <option value="">Chọn kiểu dữ liệu để thống kê</option>
        <option value="loai-sua-chua">Loại sửa chữa</option>
        <option value="ly-do-sua-chua">Lý do sửa chữa</option>
        <option value="cong-viec">Công việc</option>
      </select>
      <select name="chart-type" onChange={(e) => handleChartType(e)}>
        <option value="">Chọn loại biểu đồ</option>
        <option value="pie">Tròn</option>
        <option value="bar">Cột</option>
      </select> */}
      <select name="date-range">
        <option value="">Thống kê theo thời gian</option>
        <option value="">Tuần hiện tại</option>
        <option value="">Tháng hiện tại</option>
      </select>
    </>
  );
}
