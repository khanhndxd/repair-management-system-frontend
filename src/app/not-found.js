import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ position: "absolute", top: "50%", right: "50%", transform: "translate(50%,-50%)" }}>
        <h2>Không tìm thấy trang yêu cầu!</h2>
        <br/>
        <Link href="/" style={{ fontStyle: "italic", color: "blue" }}>
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
