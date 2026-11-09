/* Thư viện tài liệu mở: công thức (có máy tính nhanh), bảng tính Excel và bài viết. */
export type DocType = "formula" | "excel" | "article"
export type DocTag = "FDS" | "Khói và nhiệt" | "Thoát nạn" | "Pathfinder" | "Revit/BIM"

interface DocBase {
  id: string
  title: string
  desc: string
  tags: DocTag[]
}

export interface FormulaDoc extends DocBase {
  type: "formula"
  formula: string
  note: string
  calc: string
}

export interface ExcelDoc extends DocBase {
  type: "excel"
  file: string
}

export interface ArticleDoc extends DocBase {
  type: "article"
  read: string
  body: string[]
}

export type Doc = FormulaDoc | ExcelDoc | ArticleDoc

export const TYPE_LABEL: Record<DocType, string> = {
  formula: "Công thức",
  excel: "Bảng tính Excel",
  article: "Bài viết",
}

export const docTags: DocTag[] = ["FDS", "Khói và nhiệt", "Thoát nạn", "Pathfinder", "Revit/BIM"]

export const docs: Doc[] = [
  {
    id: "ct-hrr", type: "formula", title: "Đường cong phát triển cháy t²",
    desc: "Công suất cháy tăng theo bình phương thời gian, dùng để dựng đường cong HRR khi thiếu số liệu thí nghiệm.",
    tags: ["FDS", "Khói và nhiệt"], formula: "Q = α · t²",
    note: "Q (kW), t (s). α: chậm 0,00293 · trung bình 0,01172 · nhanh 0,0469 · rất nhanh 0,1876 kW/s².", calc: "hrr",
  },
  {
    id: "ct-dstar", type: "formula", title: "Đường kính đám cháy đặc trưng D* và kích thước ô lưới",
    desc: "Cơ sở chọn ô lưới FDS: tỉ số D*/dx thường nằm trong khoảng 4 đến 16.",
    tags: ["FDS"], formula: "D* = ( Q / (ρ∞ · cp · T∞ · √g) )^(2/5)",
    note: "ρ∞ = 1,204 kg/m³; cp = 1,005 kJ/(kg·K); T∞ = 293 K; g = 9,81 m/s².", calc: "dstar",
  },
  {
    id: "ct-rset", type: "formula", title: "Thời gian thoát nạn cần thiết RSET và điều kiện ASET > RSET",
    desc: "Cộng các thành phần thời gian rồi đối chiếu với thời gian thoát nạn an toàn ASET kèm hệ số an toàn.",
    tags: ["Thoát nạn", "Pathfinder"], formula: "RSET = t_phát hiện + t_báo động + t_trì hoãn + t_di chuyển\nASET ≥ k · RSET",
    note: "Hệ số k do tiêu chuẩn áp dụng hoặc cơ quan thẩm duyệt quy định.", calc: "rset",
  },
  {
    id: "ct-flow", type: "formula", title: "Vận tốc và lưu lượng dòng người theo mật độ (SFPE)",
    desc: "Quan hệ vận tốc đi bộ với mật độ người trên lối đi bằng phẳng, dùng để kiểm tra kết quả Pathfinder.",
    tags: ["Thoát nạn", "Pathfinder"], formula: "S = k · (1 − 0,266 · D)\nFs = S · D",
    note: "k = 1,4 m/s cho lối đi bằng phẳng; D (người/m²) từ 0 đến khoảng 3,7.", calc: "flow",
  },
  {
    id: "ct-vis", type: "formula", title: "Tầm nhìn xa trong khói",
    desc: "Quan hệ giữa tầm nhìn và hệ số tắt dần của khói, dùng để xác định tiêu chí ASET theo tầm nhìn.",
    tags: ["Khói và nhiệt", "FDS"], formula: "S = C / K",
    note: "K: hệ số tắt dần (1/m). C = 3 với biển hiệu phát sáng; C = 8 với vật phản xạ ánh sáng.", calc: "vis",
  },
  {
    id: "xl-hrr", type: "excel", title: "Bảng tính HRR theo đường cong t²",
    desc: "Nhập α và bước thời gian, bảng tính cho chuỗi Q theo thời gian để đưa vào PyroSim.",
    tags: ["FDS", "Khói và nhiệt"], file: "bang-tinh-hrr-t2.xlsx",
  },
  {
    id: "xl-rset", type: "excel", title: "Bảng tính RSET/ASET và hệ số an toàn",
    desc: "Nhập các thành phần thời gian; bảng tính RSET, so sánh với ASET và kết luận đạt hoặc chưa đạt.",
    tags: ["Thoát nạn"], file: "bang-tinh-rset-aset.xlsx",
  },
  {
    id: "xl-luoi", type: "excel", title: "Bảng tính D* và gợi ý kích thước ô lưới FDS",
    desc: "Nhập công suất cháy, nhận D* và dải dx từ D*/16 đến D*/4, kèm số ô theo từng mesh.",
    tags: ["FDS"], file: "bang-tinh-luoi-fds.xlsx",
  },
  {
    id: "xl-nguoi", type: "excel", title: "Bảng tính số người thoát nạn theo diện tích sàn",
    desc: "Nhập diện tích và hệ số m²/người của từng khu vực; bảng tính cộng tổng số người để đưa vào Pathfinder.",
    tags: ["Thoát nạn", "Pathfinder"], file: "bang-tinh-so-nguoi.xlsx",
  },
  {
    id: "bv-luoi", type: "article", title: "Chọn kích thước ô lưới FDS: bắt đầu từ D*/dx",
    desc: "Quy trình ba bước chọn lưới và kiểm tra độ nhạy mà không làm tăng thời gian chạy không cần thiết.",
    tags: ["FDS"], read: "6 phút đọc",
    body: [
      "Lưới quá thô cho kết quả sai về hình dạng luồng khói; lưới quá mịn làm thời gian chạy tăng rất nhanh. Cách làm phổ biến là bắt đầu từ đường kính đám cháy đặc trưng D*.",
      "Bước 1: tính D* từ công suất cháy lớn nhất Q (xem công thức trong thư viện). Bước 2: chọn dx sao cho D*/dx nằm trong khoảng 4 (lưới thô) đến 16 (lưới mịn). Với đồ án, thường chạy thử lưới thô để kiểm tra kịch bản, sau đó chạy lại lưới mịn để lấy kết quả chính thức.",
      "Bước 3: chia mesh sao cho số ô theo mỗi phương của mesh có dạng 2^a × 3^b × 5^c, vì bộ giải Poisson của FDS làm việc hiệu quả nhất với các số này. Đồng thời căn ranh mesh theo các kết cấu để tránh vật cản cắt ngang ô lưới.",
      "Cuối cùng, chạy ít nhất hai mức lưới và so sánh đại lượng dùng để kết luận (tầm nhìn, nhiệt độ ở độ cao đầu người). Nếu hai kết quả gần nhau, lưới thô hơn đã đủ cho bài toán.",
    ],
  },
  {
    id: "bv-rset", type: "article", title: "RSET gồm những thành phần nào và Pathfinder tính được phần nào",
    desc: "Phân biệt các thành phần thời gian thoát nạn để tránh nhầm khi viết thuyết minh.",
    tags: ["Thoát nạn", "Pathfinder"], read: "5 phút đọc",
    body: [
      "RSET là tổng thời gian cần thiết để toàn bộ người trong công trình đến được nơi an toàn. Nó gồm thời gian phát hiện cháy, thời gian báo động, thời gian nhận biết và phản ứng (còn gọi là thời gian trì hoãn trước khi di chuyển) và thời gian di chuyển.",
      "Pathfinder trực tiếp tính thời gian di chuyển từ hình học, số người và tốc độ đi. Các thành phần còn lại phải đưa vào bằng giả định: thời gian phát hiện và báo động lấy từ hệ thống báo cháy thiết kế, thời gian trì hoãn đưa vào như độ trễ xuất phát của từng nhóm người.",
      "Pathfinder có hai chế độ di chuyển: SFPE (dòng người theo quan hệ tốc độ – mật độ, hạn chế va chạm) và Steering (tác nhân tự tránh nhau theo hành vi). Cần nêu rõ chế độ đã dùng và lý do chọn trong thuyết minh, vì kết quả hai chế độ có thể khác nhau ở khu vực đông người.",
      "Sau khi có RSET, so sánh với ASET lấy từ FDS. Điều kiện thiết kế là ASET lớn hơn RSET kèm một hệ số an toàn do tiêu chuẩn hoặc cơ quan thẩm duyệt quy định.",
    ],
  },
  {
    id: "bv-revit", type: "article", title: "Từ Revit/CAD sang mô hình mô phỏng: quy trình năm bước",
    desc: "Làm gọn mô hình trước khi nhập vào PyroSim và Pathfinder để hạn chế lỗi hình học.",
    tags: ["Revit/BIM", "FDS", "Pathfinder"], read: "7 phút đọc",
    body: [
      "Mô hình kiến trúc đầy đủ thường quá chi tiết cho mô phỏng cháy. Mục tiêu là giữ lại những gì ảnh hưởng đến dòng khí và dòng người, loại bỏ phần còn lại.",
      "Bước 1: tạo bản sao riêng để làm sạch, không sửa mô hình gốc. Bước 2: chỉ giữ tường, sàn, trần, cửa, cầu thang, vách kính và các lỗ mở lớn; ẩn nội thất, chi tiết trang trí và hệ thống kỹ thuật nhỏ.",
      "Bước 3: kiểm tra đơn vị và gốc tọa độ, đưa công trình về gần gốc tọa độ để tránh sai số số học. Bước 4: xuất sang định dạng trao đổi mà phiên bản phần mềm đang dùng hỗ trợ (ví dụ IFC hoặc DXF) rồi nhập vào PyroSim và Pathfinder; kiểm tra danh sách định dạng trong tài liệu của đúng phiên bản.",
      "Bước 5: sau khi nhập, rà lại lỗ hổng ở tường, cửa không thông, sàn chồng lặp. Với FDS, dựng lại kết cấu theo lưới đã chọn thay vì dùng nguyên hình học cong; với Pathfinder, kiểm tra các cửa nối đúng hai phòng và cầu thang liên tục giữa các tầng.",
    ],
  },
  {
    id: "bv-ketqua", type: "article", title: "Đọc kết quả để xác định ASET: tầm nhìn, nhiệt độ và độc tính",
    desc: "Chọn đại lượng và độ cao đo để kết luận ASET, tránh trình bày kết quả đẹp nhưng không đưa ra được kết luận.",
    tags: ["Khói và nhiệt", "FDS"], read: "6 phút đọc",
    body: [
      "ASET là thời điểm đầu tiên điều kiện tại một vị trí vượt ngưỡng chịu đựng. Cần chọn trước đại lượng, ngưỡng và độ cao đo, rồi lấy thời điểm sớm nhất vượt ngưỡng trên toàn bộ đường thoát nạn.",
      "Các tiêu chí thường gặp là tầm nhìn (khoảng 10 m ở không gian lớn, khoảng 5 m ở không gian nhỏ), nhiệt độ khí ở độ cao đầu người (thường lấy khoảng 60 °C) và nồng độ khí độc như CO. Ngưỡng cụ thể phải lấy theo tiêu chuẩn áp dụng hoặc thỏa thuận với cơ quan thẩm duyệt, không chỉ dựa vào bài viết này.",
      "Đặt các thiết bị đo (slice, device) dọc đường thoát nạn ở độ cao khoảng 1,8–2,0 m, rồi xuất dữ liệu theo thời gian. Smokeview giúp quan sát, nhưng con số dùng trong thuyết minh nên lấy từ file dữ liệu của thiết bị đo.",
      "Cuối cùng, trình bày bảng ASET theo từng vị trí và từng tiêu chí, nêu rõ tiêu chí nào quyết định. Nội dung này cho thấy kết quả được hiểu và kiểm soát, không chỉ là chạy được phần mềm.",
    ],
  },
]
