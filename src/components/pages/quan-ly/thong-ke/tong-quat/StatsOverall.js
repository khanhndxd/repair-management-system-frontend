import StatsOverallItem from "./StatsOverallItem";

export default function StatsOverall() {
  return (
    <>
      <StatsOverallItem title={"Tổng số đơn bảo hành sửa chữa"} content={"count"} info={{ statusId: -1 }} />
      <StatsOverallItem title={"Đã trả hàng"} content={"count"} info={{ statusId: 9 }} />
      <StatsOverallItem title={"Đang sửa chữa"} content={"count"} info={{ statusId: 3 }} />
      {/* <StatsOverallItem title={"Tổng tiền sửa chữa"} content={"total"} /> */}
    </>
  );
}
