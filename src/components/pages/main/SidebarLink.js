"use client";
import Link from "next/link";
import styles from "@/styles/main.module.scss";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { reset } from "@/store/features/repairOrderSlice";

export default function SidebarLink(props) {
  const { content, href } = props;
  const pathname = usePathname();
  const dispatch = useDispatch();

  return (
    <Link
      onClick={() => dispatch(reset())}
      className={pathname !== href ? styles["sidebar__link"] : styles["sidebar__link--active"]}
      href={href}
    >
      <h5>{content}</h5>
    </Link>
  );
}
