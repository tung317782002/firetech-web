/* Phương pháp đánh giá chung của các báo cáo mô phỏng (tóm tắt từ báo cáo dự án của đội ngũ FireTech). */
export const method = {
  title: "Phương pháp đánh giá chung",
  intro:
    "Các báo cáo mô phỏng được lập theo hướng thiết kế theo tính năng: với mỗi kịch bản cháy, nhóm thực hiện so sánh thời gian an toàn sẵn có (ASET) với thời gian thoát nạn cần thiết (RSET). Quy trình gồm 10 bước, có thể tóm lược thành năm giai đoạn.",
  stages: [
    { name: "Xác định mục tiêu", text: "chỉ ra hạng mục chưa đáp ứng quy chuẩn và điều cần chứng minh, thường là khả năng thoát nạn an toàn." },
    { name: "Đặt tiêu chí và giải pháp", text: "xác định các ngưỡng an toàn, đề xuất giải pháp tăng cường về kiến trúc và cơ điện." },
    { name: "Xây dựng kịch bản cháy", text: "chọn vị trí cháy, xác định tốc độ toả nhiệt (HRR) và đường cong phát triển của đám cháy." },
    { name: "Mô phỏng", text: "dùng FDS (qua PyroSim) để xác định ASET và Pathfinder để xác định RSET." },
    { name: "Kiểm tra", text: "nếu ASET chưa lớn hơn RSET, điều chỉnh giải pháp thiết kế và mô phỏng lại." },
  ],
  rsetTitle: "Cách tính thời gian thoát nạn cần thiết",
  rsetFormula: "RSET = Δt phát hiện + Δt báo động + Δt chuẩn bị + Δt di chuyển",
  rsetParts: [
    { name: "Thời gian phát hiện cháy", text: "lấy từ mô hình FDS, tại thời điểm đầu báo khói bị che khuất từ 15%/m trở lên (hoặc theo ngưỡng của đầu báo kiểu hút)." },
    { name: "Thời gian chuẩn bị di tản", text: "theo PD 7974-6:2019, từ 90 đến 330 giây khi người không nhìn thấy trực tiếp đám cháy; 30 đến 60 giây khi nhìn thấy trực tiếp." },
    { name: "Thời gian di chuyển", text: "lấy từ mô hình Pathfinder. Tốc độ đi bộ phân bố ngẫu nhiên trong khoảng 0,8–1,7 m/s (trung bình 1,2 m/s theo sổ tay SFPE); tốc độ trên cầu thang lấy bằng khoảng một nửa." },
  ],
  criteria: {
    caption: "Tiêu chí an toàn đối với con người (đo tại độ cao 2–2,1 m tính từ sàn)",
    head: ["Yếu tố", "Ngưỡng an toàn", "Nguồn tham chiếu"],
    rows: [
      ["Nhiệt độ (nhiệt đối lưu)", "≤ 60°C", "Fire Engineering Design Guide"],
      ["Nhiệt bức xạ", "≤ 2,5 kW/m² (tương đương lớp khói < 200°C)", "Fire Engineering Design Guide"],
      ["Tầm nhìn", "≥ 10 m trong không gian lớn", "Fire Engineering Design Guide"],
      ["Khí độc tích luỹ (FED)", "< 0,3", "ISO 13571:2012"],
    ],
  },
  safetyFactor: "kịch bản thiết kế yêu cầu ASET > 1,5 × RSET; kịch bản phân tích độ nhạy yêu cầu ASET > 1,0 × RSET.",
  references:
    "QCVN 06:2022/BXD (kèm Sửa đổi 1:2023), TCVN 7336:2021, SFPE Handbook of Fire Protection Engineering, NFPA 101, NFPA 92, PD 7974-6:2019, ISO/TR 16738:2009, ISO 13571:2012, BRE 368 và Fire Engineering Design Guide.",
  software: "PyroSim/FDS cho mô phỏng cháy và khói, Pathfinder cho mô phỏng thoát nạn (Thunderhead Engineering, phiên bản 2024–2025).",
  source: "Nguồn: tóm tắt từ báo cáo dự án của đội ngũ FireTech. Số liệu thuộc từng dự án cụ thể, không dùng thay cho tính toán của công trình khác.",
} as const
