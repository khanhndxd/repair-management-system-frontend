import styles from "@/styles/main.module.scss";
import Link from "next/link";
import SidebarLink from "@/components/pages/main/SidebarLink";
import SidebarAccount from "@/components/pages/main/SidebarAccount";

export default function ManagementLayout({ children }) {
  return (
    <div className={styles["management"]}>
      <aside className={styles["sidebar"]}>
        <div className={styles["sidebar__logo"]}>
          <Link href="/">
            <h1>LOGO</h1>
          </Link>
        </div>
        <SidebarLink content={"Trang chủ"} href="/quan-ly" />
        <SidebarLink content={"Quản lý bảo hành/sửa chữa"} href="/quan-ly/bao-hanh-sua-chua" />
        <SidebarLink content={"Quản lý khách hàng"} href="/quan-ly/khach-hang" />
        <SidebarLink content={"Tiếp nhận bảo hành"} href="/quan-ly/tiep-nhan-bao-hanh" />
        <SidebarAccount />
      </aside>
      <div className={styles["dashboard"]}>{children}</div>
    </div>
  );
}
