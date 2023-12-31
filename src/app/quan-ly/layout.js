import styles from "@/styles/main.module.scss";
import Link from "next/link";
import SidebarLink from "@/components/pages/main/SidebarLink";
import SidebarAccount from "@/components/pages/main/SidebarAccount";
import TechIcon from "@/styles/icons/technology.svg";
import Image from "next/image";

export default function ManagementLayout({ children }) {
  return (
    <div className={styles["management"]}>
      <aside className={styles["sidebar"]}>
        <div className={styles["sidebar__logo"]}>
          <Link href="/">
            <Image priority src={TechIcon} width={35} height={35} alt="logo" />
          </Link>
          <span>NDK</span>
        </div>
        <SidebarLink content={"Trang chủ"} href="/quan-ly" />
        <SidebarLink content={"Quản lý bảo hành/sửa chữa"} href="/quan-ly/bao-hanh-sua-chua" />
        <SidebarLink content={"Quản lý khách hàng"} href="/quan-ly/khach-hang" />
        <SidebarLink content={"Tiếp nhận bảo hành"} href="/quan-ly/tiep-nhan-bao-hanh" />
        <SidebarLink content={"Quản lý lý do bảo hành"} href="/quan-ly/ly-do-bao-hanh" />
        <SidebarLink content={"Quản lý tài khoản"} href="/quan-ly/tai-khoan" />
        <SidebarLink content={"Thống kê"} href="/quan-ly/thong-ke" />
        <SidebarAccount />
      </aside>
      <div className={styles["dashboard"]}>{children}</div>
    </div>
  );
}
