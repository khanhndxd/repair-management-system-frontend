import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import styles from "@/styles/main.module.scss";
import SidebarLink from "@/components/pages/main/SidebarLink";
import SidebarAccount from "@/components/pages/main/SidebarAccount";
import Providers from "./providers";
import Notification from "@/components/common/Notification";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hệ thống quản lý bảo hành sửa chữa",
  description: "Website quản lý bảo dưỡng PC và linh kiện điện tử",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Notification />
          <div className={styles["management"]}>
            <aside className={styles["sidebar"]}>
              <div className={styles["sidebar__logo"]}>
                <Link href="/">
                  <h1>LOGO</h1>
                </Link>
              </div>
              <SidebarLink content={"Quản lý chung"} href="/" />
              <SidebarLink content={"Quản lý bảo hành/sửa chữa"} href="/bao-hanh-sua-chua" />
              <SidebarLink content={"Quản lý khách hàng"} href="/khach-hang" />
              <SidebarAccount />
            </aside>
            <div className={styles["dashboard"]}>{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
