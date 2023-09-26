"use client";
import Link from "next/link";
import styles from "@/styles/main.module.scss";
import { usePathname } from "next/navigation";

export default function SidebarLink(props) {
  const { content, href } = props;
  const pathname = usePathname();

  return (
    <Link
      className={pathname !== href ? styles["sidebar__link"] : styles["sidebar__link--active"]}
      href={href}
    >
      <h5>{content}</h5>
    </Link>
  );
}
