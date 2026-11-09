/* Đề tài đồ án và luận văn gợi ý. Thêm phần tử vào mảng là danh sách, bộ lọc và số liệu tự cập nhật. */
export type Field = "PCCC" | "Kiến trúc"
export type Level = "Đồ án môn học" | "Đồ án tốt nghiệp" | "Luận văn thạc sĩ"
export type Tool = "PyroSim" | "FDS" | "Pathfinder"

export interface Topic {
  id: string
  title: string
  field: Field
  level: Level
  tools: Tool[]
  summary: string
  outcomes: string[]
  standards: string
}

export const topics: Topic[] = [
  {
    id: "khoi-ham-do-xe",
    title: "Mô phỏng lan truyền khói trong tầng hầm đỗ xe và đánh giá hệ thống hút khói",
    field: "PCCC",
    level: "Đồ án tốt nghiệp",
    tools: ["PyroSim", "FDS"],
    summary: "Dựng một tầng hầm điển hình, đặt đám cháy xe con và so sánh các phương án quạt hút hoặc quạt jet fan theo tầm nhìn và nhiệt độ.",
    outcomes: ["Đường cong HRR cho xe con", "Bản đồ tầm nhìn theo thời gian", "So sánh 2–3 phương án hút khói"],
    standards: "QCVN 06:2022/BXD, NFPA 92",
  },
  {
    id: "rset-trung-tam-thuong-mai",
    title: "Đánh giá thời gian thoát nạn RSET của trung tâm thương mại theo các phương án bố trí cửa và thang",
    field: "PCCC",
    level: "Đồ án tốt nghiệp",
    tools: ["Pathfinder"],
    summary: "Mô phỏng hàng nghìn người di chuyển, thay đổi số lượng và vị trí lối ra để xác định điểm nghẽn và RSET lớn nhất.",
    outcomes: ["RSET từng phương án", "Bản đồ mật độ người", "Đề xuất điều chỉnh lối thoát nạn"],
    standards: "QCVN 06:2022/BXD, NFPA 101",
  },
  {
    id: "thang-bo-chung-cu",
    title: "Kiểm tra ASET/RSET cho chung cư cao tầng: thang bộ thoát nạn và hành lang chung",
    field: "PCCC",
    level: "Luận văn thạc sĩ",
    tools: ["PyroSim", "FDS", "Pathfinder"],
    summary: "Kết hợp kết quả khói từ FDS với thoát nạn từ Pathfinder để đối chiếu ASET với RSET kèm hệ số an toàn.",
    outcomes: ["Kịch bản cháy tại căn hộ và hành lang", "ASET theo tầm nhìn và nhiệt độ", "Biên an toàn ASET so với RSET"],
    standards: "QCVN 06:2022/BXD, NFPA 101",
  },
  {
    id: "atrium-thoat-khoi",
    title: "Thiết kế giếng trời (atrium) kết hợp thoát khói tự nhiên trong trung tâm hội nghị",
    field: "Kiến trúc",
    level: "Đồ án tốt nghiệp",
    tools: ["PyroSim", "FDS"],
    summary: "Khảo sát ảnh hưởng của chiều cao, diện tích cửa mái và vị trí cửa bù khí đến lớp khói trong không gian rỗng lớn.",
    outcomes: ["Chiều cao lớp khói theo thời gian", "So sánh diện tích cửa thoát khói", "Hiệu chỉnh giải pháp kiến trúc"],
    standards: "NFPA 92, QCVN 06:2022/BXD",
  },
  {
    id: "hanh-lang-truong-hoc",
    title: "Tối ưu bố trí hành lang và cầu thang trường học theo kịch bản thoát nạn giờ ra chơi",
    field: "Kiến trúc",
    level: "Đồ án môn học",
    tools: ["Pathfinder"],
    summary: "So sánh hành lang giữa và hành lang bên, vị trí cầu thang, bề rộng cửa phòng học trong tình huống đông học sinh.",
    outcomes: ["RSET theo từng phương án mặt bằng", "Điểm nghẽn tại chân cầu thang", "Khuyến nghị bề rộng tối thiểu"],
    standards: "QCVN 06:2022/BXD, NFPA 101",
  },
  {
    id: "kho-xep-gia",
    title: "Mô phỏng cháy kho hàng xếp giá cao: ảnh hưởng của đầu phun sprinkler đến đường cong HRR",
    field: "PCCC",
    level: "Luận văn thạc sĩ",
    tools: ["PyroSim", "FDS"],
    summary: "Mô hình hóa đầu phun, RTI và nhiệt độ kích hoạt; đánh giá khả năng khống chế đám cháy với các mật độ phun khác nhau.",
    outcomes: ["Thời điểm kích hoạt sprinkler", "HRR có và không có sprinkler", "Phân tích độ nhạy theo RTI"],
    standards: "NFPA 13, NFPA 72",
  },
  {
    id: "be-rong-loi-thoat",
    title: "Ảnh hưởng của bề rộng lối thoát nạn đến lưu lượng dòng người qua cửa",
    field: "Kiến trúc",
    level: "Đồ án môn học",
    tools: ["Pathfinder"],
    summary: "Chạy chuỗi mô phỏng thay đổi bề rộng cửa từ 0,9 m đến 2,4 m, vẽ quan hệ giữa bề rộng và lưu lượng riêng.",
    outcomes: ["Biểu đồ lưu lượng theo bề rộng", "So sánh với công thức SFPE", "Nhận xét ngưỡng hiệu quả"],
    standards: "NFPA 101, SFPE Handbook",
  },
  {
    id: "sfpe-so-voi-steering",
    title: "So sánh hai chế độ di chuyển SFPE và Steering trong Pathfinder trên cùng một công trình",
    field: "PCCC",
    level: "Luận văn thạc sĩ",
    tools: ["Pathfinder"],
    summary: "Phân tích khác biệt về RSET, mật độ và hành vi tránh va chạm giữa hai chế độ; đánh giá độ nhạy tham số.",
    outcomes: ["RSET hai chế độ", "Đánh giá độ nhạy tham số", "Khuyến nghị chọn chế độ theo bài toán"],
    standards: "SFPE Handbook, hướng dẫn kỹ thuật Pathfinder",
  },
  {
    id: "revit-sang-mo-phong",
    title: "Quy trình từ mô hình BIM Revit sang mô phỏng cháy và thoát nạn: chuẩn hóa dữ liệu đầu vào",
    field: "Kiến trúc",
    level: "Luận văn thạc sĩ",
    tools: ["PyroSim", "FDS", "Pathfinder"],
    summary: "Xây dựng quy tắc đơn giản hóa mô hình, đặt tên đối tượng và xuất file để rút ngắn thời gian dựng mô hình mô phỏng.",
    outcomes: ["Danh mục kiểm tra chuẩn hóa mô hình Revit", "Đo thời gian dựng trước và sau", "Quy trình áp dụng cho dự án thực"],
    standards: "Hướng dẫn BIM của dự án, tài liệu phần mềm",
  },
]
