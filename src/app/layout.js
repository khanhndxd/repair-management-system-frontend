import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Notification from "@/components/common/Notification";
import Dialog from "@/components/common/Dialog";
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
          <Dialog />
          {children}
        </Providers>
      </body>
    </html>
  );
}
