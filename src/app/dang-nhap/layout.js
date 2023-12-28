import styles from "@/styles/main.module.scss";
import TechIcon from "@/styles/icons/technology.svg";
import Image from "next/image";

export default function LoginLayout({ children }) {
  return (
    <div className={styles["login"]}>
      <div className={styles["login__logo"]}>
        <div>
          <Image priority src={TechIcon} width={35} height={35} alt="logo" />
        </div>
        <span>NDK</span>
      </div>
      {children}
    </div>
  );
}
