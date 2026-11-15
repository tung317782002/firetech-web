/* Thư viện tài liệu mở: công thức (có máy tính nhanh), bảng tính Excel, bài viết, mẫu kịch bản/checklist và danh mục tiêu chuẩn. */
export type DocType = "formula" | "excel" | "article" | "template" | "standard"
export type DocTag = "FDS" | "Khói và nhiệt" | "Thoát nạn" | "Pathfinder" | "Revit/BIM" | "Tiêu chuẩn"

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

/** Mẫu kịch bản hoặc checklist: danh sách mục cần điền hoặc cần kiểm. */
export interface TemplateDoc extends DocBase {
  type: "template"
  read: string
  items: string[]
}

/** Tiêu chuẩn hoặc nguồn dữ liệu: chỉ nêu tên, mã và phạm vi, không chép nội dung có bản quyền. */
export interface StandardDoc extends DocBase {
  type: "standard"
  code: string
  scope: string
}

export type Doc = FormulaDoc | ExcelDoc | ArticleDoc | TemplateDoc | StandardDoc
/** Tài liệu mở được trong hộp thoại đọc. */
export type ReadableDoc = ArticleDoc | TemplateDoc

export const TYPE_LABEL: Record<DocType, string> = {
  formula: "Công thức",
  excel: "Bảng tính Excel",
  article: "Bài viết",
  template: "Mẫu và checklist",
  standard: "Tiêu chuẩn",
}

export const docTags: DocTag[] = ["FDS", "Khói và nhiệt", "Thoát nạn", "Pathfinder", "Revit/BIM", "Tiêu chuẩn"]

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
      "Đặt các thiết bị đo (slice, device) dọc đường thoát nạn ở độ cao khoảng 2,0–2,1 m, rồi xuất dữ liệu theo thời gian. Smokeview giúp quan sát, nhưng con số dùng trong thuyết minh nên lấy từ file dữ liệu của thiết bị đo.",
      "Cuối cùng, trình bày bảng ASET theo từng vị trí và từng tiêu chí, nêu rõ tiêu chí nào quyết định. Nội dung này cho thấy kết quả được hiểu và kiểm soát, không chỉ là chạy được phần mềm.",
    ],
  },
  {
    id: "bv-tieu-chi", type: "article", title: "Tiêu chí an toàn đối với con người: nhiệt độ, nhiệt bức xạ, tầm nhìn và khí độc",
    desc: "Bốn ngưỡng dùng để xác định ASET và độ cao đo tương ứng, kèm hệ số an toàn thường áp dụng.",
    tags: ["Khói và nhiệt", "Thoát nạn"], read: "4 phút đọc",
    body: [
      "Khi xác định ASET, điều kiện được đo ở độ cao 2–2,1 m tính từ sàn, tức khoảng đầu người. Bốn yếu tố thường được dùng làm tiêu chí.",
      "Nhiệt độ (nhiệt đối lưu) không vượt 60°C. Nhiệt bức xạ không vượt 2,5 kW/m², tương đương lớp khói có nhiệt độ dưới 200°C. Tầm nhìn tối thiểu 10 m trong không gian lớn; với phòng nhỏ, mật độ khói cho phép có thể lớn gấp đôi. Khí độc tích luỹ, biểu thị bằng liều FED, nhỏ hơn 0,3 (theo ISO 13571:2012).",
      "Kịch bản thiết kế yêu cầu ASET lớn hơn 1,5 lần RSET; kịch bản phân tích độ nhạy yêu cầu ASET lớn hơn 1,0 lần RSET. Ngưỡng cụ thể vẫn phải lấy theo tiêu chuẩn áp dụng hoặc thỏa thuận với cơ quan thẩm duyệt.",
    ],
  },
  {
    id: "bv-hrr", type: "article", title: "Đường cong phát triển đám cháy: chọn HRR và hệ số α",
    desc: "Đám cháy thiết kế thường được mô tả bằng hàm bậc hai theo thời gian; cách đọc và kiểm tra một đường cong.",
    tags: ["Khói và nhiệt", "FDS"], read: "4 phút đọc",
    body: [
      "Tốc độ toả nhiệt (HRR) của đám cháy giai đoạn phát triển thường được mô tả bằng hàm bậc hai Q = α·t², trong đó α phụ thuộc vào chất cháy và cách chất xếp.",
      "Ví dụ trong một báo cáo kho kệ cao, đám cháy được lấy theo Q = 0,0469·t² và đạt đỉnh khoảng 1.400 kW sau khoảng 173 giây, khi sprinkler kích hoạt. Kiểm tra nhanh: 0,0469 × 173² ≈ 1.404 kW, khớp với giá trị đỉnh nêu trên.",
      "Công suất toả nhiệt lớn nhất cũng là đầu vào để tính đường kính đám cháy đặc trưng D* và chọn lưới cho FDS. Hãy dùng công thức và máy tính nhanh trong thư viện, và ghi rõ nguồn của α trong thuyết minh.",
    ],
  },
  {
    id: "mau-kich-ban", type: "template", title: "Mẫu kịch bản cháy",
    desc: "Các mục cần điền khi mô tả một kịch bản cháy, để người đọc báo cáo kiểm lại được từng giả định.",
    tags: ["Thoát nạn", "Khói và nhiệt"], read: "8 mục",
    items: [
      "Mục tiêu mô phỏng và hạng mục chưa đáp ứng quy chuẩn cần chứng minh.",
      "Vị trí đám cháy và lý do chọn (kịch bản làm RSET dài nhất và/hoặc ASET ngắn nhất).",
      "Chất cháy và đường cong HRR: hệ số α, công suất lớn nhất, thời điểm đạt đỉnh.",
      "Hệ thống phát hiện, chữa cháy và hút khói, cùng trạng thái hoạt động giả định.",
      "Số người, phân bố theo khu vực, các nhóm người và thời gian chuẩn bị di tản.",
      "Tiêu chí an toàn và độ cao đo: nhiệt độ, nhiệt bức xạ, tầm nhìn, FED.",
      "Thời gian mô phỏng, lưới tính và cách chia mesh.",
      "Nguồn của từng giả định: tiêu chuẩn, sổ tay hoặc báo cáo tham khảo.",
    ],
  },
  {
    id: "checklist-mo-hinh", type: "template", title: "Checklist kiểm tra mô hình trước khi chạy",
    desc: "Các điểm cần rà trong PyroSim và Pathfinder để hạn chế lỗi hình học, lưới tính và thiết lập người.",
    tags: ["FDS", "Pathfinder", "Revit/BIM"], read: "9 mục",
    items: [
      "Đơn vị và gốc tọa độ đã kiểm tra; công trình nằm gần gốc tọa độ.",
      "Hình học không còn lỗ hổng ở tường, cửa nối đúng hai phòng, cầu thang liên tục giữa các tầng.",
      "Mesh phủ kín công trình, ranh mesh căn theo kết cấu; D*/dx nằm trong khoảng 4–16.",
      "Vật liệu và bề mặt đã gán; lỗ mở, cửa và quạt đặt đúng vị trí.",
      "Đường cong HRR khớp kịch bản; thời gian mô phỏng đủ dài để thấy kết quả cần kết luận.",
      "Thiết bị đo (slice, device) đặt dọc đường thoát nạn ở độ cao 2,0–2,1 m.",
      "Pathfinder: hồ sơ người, tốc độ đi (0,8–1,7 m/s), thời gian trì hoãn, tốc độ cầu thang và chế độ di chuyển (SFPE hoặc Steering) đã đặt.",
      "Đã chạy thử lưới thô để kiểm tra kịch bản trước khi chạy lưới mịn.",
      "Đã chạy ít nhất hai mức lưới để kiểm tra độ nhạy của kết luận.",
    ],
  },
  {
    id: "tc-qcvn06", type: "standard", title: "QCVN 06:2022/BXD (kèm Sửa đổi 1:2023)",
    desc: "Quy chuẩn kỹ thuật quốc gia về an toàn cháy cho nhà và công trình.",
    tags: ["Tiêu chuẩn", "Thoát nạn"], code: "QCVN 06",
    scope: "Căn cứ chính của hồ sơ thiết kế và thẩm duyệt về PCCC tại Việt Nam, gồm yêu cầu về thoát nạn.",
  },
  {
    id: "tc-nfpa101", type: "standard", title: "NFPA 101: Life Safety Code",
    desc: "Bộ quy tắc về an toàn tính mạng trong công trình do NFPA ban hành.",
    tags: ["Tiêu chuẩn", "Thoát nạn"], code: "NFPA 101",
    scope: "Yêu cầu về lối thoát nạn và bảo vệ người sử dụng theo loại hình công trình.",
  },
  {
    id: "tc-nfpa92", type: "standard", title: "NFPA 92: Standard for Smoke Control Systems",
    desc: "Tiêu chuẩn về hệ thống kiểm soát khói do NFPA ban hành.",
    tags: ["Tiêu chuẩn", "Khói và nhiệt"], code: "NFPA 92",
    scope: "Thiết kế, lắp đặt và nghiệm thu hệ thống kiểm soát khói.",
  },
  {
    id: "nguon-nist", type: "standard", title: "Dữ liệu và phần mềm của NIST",
    desc: "FDS, Smokeview, tài liệu kỹ thuật và dữ liệu do NIST công bố được phép dùng.",
    tags: ["Tiêu chuẩn", "FDS"], code: "NIST",
    scope: "Nguồn tham khảo cho mô hình, tài liệu kiểm chứng và dữ liệu thực nghiệm; kiểm tra điều khoản sử dụng trước khi trích dẫn.",
  },
]
