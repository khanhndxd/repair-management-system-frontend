"use client";

export default function ChartConfig(props) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <input type="radio" id="contactChoice1" name="contact" value="email" />
        <label htmlFor="contactChoice1">Bảo hành</label>
      </div>
      <div>
        <input type="radio" id="contactChoice2" name="contact" value="phone" />
        <label htmlFor="contactChoice2">Sửa chữa</label>
      </div>
      <div>
        <input type="radio" id="contactChoice3" name="contact" value="mail" />
        <label htmlFor="contactChoice3">Đổi mới</label>
      </div>
    </div>
  );
}
