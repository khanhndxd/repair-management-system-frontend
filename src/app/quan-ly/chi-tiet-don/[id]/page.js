"use client";
import Loading from "@/app/loading";
import CustomerInfo from "@/components/pages/quan-ly/chi-tiet-don/CustomerInfo";
import RepairAccessoryList from "@/components/pages/quan-ly/chi-tiet-don/RepairAccessoryList";
import RepairActions from "@/components/pages/quan-ly/chi-tiet-don/RepairActions";
import RepairOrderDetailInfo from "@/components/pages/quan-ly/chi-tiet-don/RepairOrderDetailInfo";
import { useGetRepairOrderByIdQuery } from "@/services/api/repairOrder/repairOrderApi";
import styles from "@/styles/main.module.scss";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function RepairOrderDetail() {
  const router = useRouter();
  const params = useParams();
  const { data, isLoading, isFetching, isError, error } = useGetRepairOrderByIdQuery(params.id);

  if (isError) return <div>Có lỗi xảy ra</div>;

  if (isLoading || isFetching) return <Loading />;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles["dashboard__orderdetail"]}>
      <div className={styles["dashboard__orderdetail__header"]}>
        <span onClick={handleBack}>&#10140;</span>
        <h1>Chi tiết phiếu bảo hành</h1>
      </div>
      <div className={styles["dashboard__orderdetail__actions"]}>
        <h2>{params.id} - Phiếu tiếp nhận bảo hành</h2>
        <Link href={`/quan-ly/chi-tiet-don/chinh-sua/${params.id}`}>Chỉnh sửa</Link>
        <RepairActions
          customer={data.data.customer}
          createdAt={data.data.createdAt}
          receiveAt={data.data.receiveAt}
          repairReason={data.data.repairReason}
          repairOrderId={data.data.id}
          createdBy={data.data.createdBy.id}
          repairedBy={data.data.repairedBy.id}
          currentStatus={data.data.status.id}
          repairAccessories={data.data.repairAccessories}
          repairProducts={data.data.repairProducts}
          repairTasks={data.data.repairTasks}
          repairCustomerProducts={data.data.repairCustomerProducts}
          totalPrice={data.data.totalPrice}
        />
      </div>
      <div className={styles["dashboard__orderdetail__content"]}>
        <div className={styles["dashboard__orderdetail__content__box"]}>
          <h3>Phiếu tiếp nhận bảo hành - {params.id}</h3>
          <CustomerInfo
            customer={data.data.customer}
            createdBy={data.data.createdBy}
            repairedBy={data.data.repairedBy}
            repairProduct={data.data.repairProducts}
            repairTasks={data.data.repairTasks}
            repairCustomerProducts={data.data.repairCustomerProducts}
            status={data.data.status.id}
            total={data.data.totalPrice}
          />
        </div>
        <div className={styles["dashboard__orderdetail__content__box"]}>
          <RepairOrderDetailInfo
            createdAt={data.data.createdAt}
            receiveAt={data.data.receiveAt}
            repairReason={data.data.repairReason}
            receiveType={data.data.receiveType}
            note={data.data.note}
            status={data.data.status}
          />
          <div>
            <p style={{ marginBottom: "4px" }}>
              <strong>Linh kiện thay thế</strong>
            </p>
            <RepairAccessoryList repairAccessories={data.data.repairAccessories} />
          </div>
        </div>
      </div>
    </div>
  );
}
