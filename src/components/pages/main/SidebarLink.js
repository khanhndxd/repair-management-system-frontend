"use client";
import Link from "next/link";
import styles from "@/styles/main.module.scss";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/store/features/repairOrderSlice";
import { roles } from "@/services/helper/helper";
import { useLayoutEffect, useState } from "react";

export default function SidebarLink(props) {
  const { content, href } = props;
  const auth = useSelector((state) => state.auth);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [isClient, setIsClient] = useState(false);

  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  if (
    isClient &&
    (href === "/quan-ly/tai-khoan" ||
      href === "/quan-ly/thong-ke" ||
      href === "/quan-ly/khach-hang" ||
      href === "/quan-ly/tiep-nhan-bao-hanh" ||
      href === "/quan-ly/ly-do-bao-hanh")
  ) {
    if (auth.role === roles.admin) {
      return (
        <Link
          onClick={() => dispatch(reset())}
          className={pathname !== href ? styles["sidebar__link"] : styles["sidebar__link--active"]}
          href={href}
        >
          <h5>{content}</h5>
        </Link>
      );
    } else if (auth.role !== roles.technician) {
      if (href === "/quan-ly/khach-hang" || href === "/quan-ly/tiep-nhan-bao-hanh" || href === "/quan-ly/ly-do-bao-hanh") {
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
    }
    return null;
  } else {
    if (
      href !== "/quan-ly/tai-khoan" &&
      href !== "/quan-ly/thong-ke" &&
      href !== "/quan-ly/khach-hang" &&
      href !== "/quan-ly/tiep-nhan-bao-hanh" &&
      href !== "/quan-ly/ly-do-bao-hanh"
    ) {
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
  }
}
