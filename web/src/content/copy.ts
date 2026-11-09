/*
 * NỘI DUNG CHỮ: tiêu đề, đoạn dẫn và nhãn nút của trang, gom về một chỗ để rà soát và thay.
 * Quy ước: giọng học thuật, chính xác; nói đúng việc học viên làm được; giữ nguyên thuật ngữ
 * PyroSim, FDS, Pathfinder, Smokeview, ASET/RSET, HRR, QCVN 06, NFPA. Số liệu minh họa luôn ghi rõ là minh họa.
 */
export const copy = {
  nav: [
    { id: "gioi-thieu", label: "Giới thiệu" },
    { id: "phan-mem", label: "Phần mềm" },
    { id: "de-tai", label: "Đề tài" },
    { id: "mo-phong", label: "Mô phỏng" },
    { id: "thu-vien", label: "Thư viện" },
    { id: "hoc-phi", label: "Học phí" },
    { id: "zalo", label: "Zalo" },
  ],
  cta: { register: "Đăng ký khóa học", simulator: "Xem trình mô phỏng" },

  hero: {
    eyebrow: "Dành cho sinh viên và học viên cao học ngành PCCC, Kiến trúc",
    title: "Học mô phỏng cháy và thoát nạn bằng PyroSim, FDS và Pathfinder",
    lead: "Khóa học đi theo quy trình của một đồ án: dựng mô hình từ bản vẽ CAD hoặc Revit, thiết lập kịch bản cháy, tính ASET và RSET, rồi trình bày kết quả. Kèm thư viện tài liệu mở và nhóm Zalo gỡ lỗi.",
    facts: [
      { k: "Phần mềm", v: "PyroSim, FDS, Pathfinder" },
      { k: "Tiêu chuẩn tham chiếu", v: "QCVN 06, NFPA" },
      { k: "Hình thức", v: "Theo buổi, có nhóm Zalo hỗ trợ" },
    ],
    cardNote: "Minh họa: bản vẽ CAD/Revit (trái) và mô hình mô phỏng (phải)",
    videoCaption: "Video giới thiệu khóa học",
  },

  tools: { label: "Phần mềm và tiêu chuẩn trong khóa học", items: ["PyroSim", "FDS", "Pathfinder", "Smokeview", "QCVN 06", "NFPA 101", "NFPA 92"] },

  workflow: {
    title: "Các bước của một đồ án mô phỏng",
    intro: "Ba giai đoạn thường gặp khi làm đồ án mô phỏng cháy và thoát nạn. Mỗi giai đoạn có bài học và tài liệu tương ứng trong khóa học.",
    steps: [
      { n: "01", title: "Mô hình hóa", items: ["Làm sạch bản vẽ CAD hoặc Revit", "Nhập hình học vào PyroSim và Pathfinder", "Chia mesh và chọn ô lưới theo D*/dx", "Gán vật liệu, cửa, lỗ mở, quạt"] },
      { n: "02", title: "Mô phỏng", items: ["Xây dựng kịch bản cháy và đường cong HRR", "Hồ sơ người, tốc độ đi, thời gian trì hoãn", "Chạy FDS, theo dõi log và xử lý lỗi", "Chế độ SFPE và Steering trong Pathfinder"] },
      { n: "03", title: "Báo cáo", items: ["Đọc kết quả bằng Smokeview", "Xác định ASET theo tầm nhìn và nhiệt độ", "Tính RSET và đối chiếu hệ số an toàn", "Trình bày thuyết minh theo QCVN 06, NFPA"] },
    ],
  },

  software: {
    title: "Phần mềm sử dụng trong khóa học",
    intro: "Mỗi phần mềm trả lời một câu hỏi khác nhau. Kết quả của chúng ghép lại thành phép đối chiếu ASET với RSET.",
    items: [
      { slot: "software-pyrosim", tag: "Mô phỏng cháy", tone: "ember", name: "PyroSim + FDS", body: "PyroSim là giao diện đồ họa để dựng mô hình cho FDS (Fire Dynamics Simulator), bộ giải động lực học chất lỏng do NIST phát triển. Dùng để tính khói, nhiệt, tầm nhìn và nồng độ khí độc.", gives: "Cho kết quả: ASET." },
      { slot: "software-pathfinder", tag: "Mô phỏng thoát nạn", tone: "teal", name: "Pathfinder", body: "Mô phỏng dòng người di chuyển trong công trình: hồ sơ người, thời gian trì hoãn, cửa, thang và chế độ di chuyển SFPE hoặc Steering.", gives: "Cho kết quả: thời gian di chuyển và RSET." },
      { slot: "software-fds", tag: "Xem kết quả", tone: "ink", name: "Smokeview", body: "Trình xem kết quả của FDS: khói, nhiệt độ, tầm nhìn và các lát cắt theo thời gian. Dùng để kiểm tra kịch bản và lấy hình đưa vào thuyết minh.", gives: "Cho kết quả: hình ảnh và số liệu theo thời gian." },
    ],
    legal: "PyroSim và Pathfinder là sản phẩm của Thunderhead Engineering. FDS và Smokeview do NIST phát triển. Trang này không phải đại diện chính thức của các nhà phát hành.",
  },

  topics: {
    title: "Đề tài đồ án và luận văn gợi ý",
    intro: "Các đề tài PCCC và Kiến trúc có thể thực hiện với PyroSim, FDS, Pathfinder, kèm kết quả cần đạt và tiêu chuẩn tham chiếu.",
    filters: { field: "Lĩnh vực", level: "Cấp", tool: "Phần mềm", all: "Tất cả" },
    copy: "Sao chép gợi ý",
    enroll: "Đăng ký học theo đề tài này",
    none: "Không có đề tài phù hợp, hãy đổi bộ lọc.",
    prefix: "Quan tâm đề tài: ",
    standards: "Tiêu chuẩn: ",
    outcomes: "Kết quả cần đạt",
  },

  simulator: {
    title: "So sánh bản vẽ CAD/Revit với mô hình mô phỏng",
    intro: "Kéo thanh trượt để so sánh bản vẽ thô (trái) với mô hình PyroSim và Pathfinder (phải). Kéo thanh thời gian và chọn từng phòng để xem chi tiết. Số liệu trong phần này chỉ để minh họa.",
    left: "Bản vẽ CAD/Revit",
    right: "PyroSim + Pathfinder",
    idle: "Bấm vào một phòng trên mô hình, hoặc chọn trong danh sách bên dưới mô hình, để xem diện tích, số người và tình trạng khói tại thời điểm đang xem.",
    legend: "Chấm xanh là người đang di chuyển, chấm vàng là người đang trong vùng khói. Mô hình chỉ minh họa, không thay thế tính toán cho công trình thực.",
  },

  library: {
    title: "Thư viện tài liệu mở",
    intro: "Công thức có máy tính nhanh, bảng tính Excel và bài viết kỹ thuật. Tất cả miễn phí, không cần đăng nhập.",
    search: "Tìm công thức, bảng tính, bài viết…",
    empty: "Không có tài liệu phù hợp. Hãy thử từ khóa khác hoặc xóa bộ lọc.",
  },

  gallery: {
    title: "Kết quả mô phỏng của học viên",
    intro: "Khu vực dành cho hình ảnh và video kết quả mô phỏng từ các đồ án.",
  },

  stats: {
    eyebrow: "Thư viện mở",
    title: "Miễn phí, không cần đăng nhập",
  },

  pricing: {
    title: "Học phí",
    intro: "Gói PyroSim + Pathfinder dành cho dựng mô hình và tính thoát nạn; gói FDS + Edit video + Xuất báo cáo dành cho hoàn thiện đồ án. Học phí có thể thay đổi, liên hệ để được tư vấn lịch học.",
    unit: "/ khóa",
    pick: "Đăng ký gói này",
  },

  zalo: {
    title: "Nhóm Zalo trao đổi và gỡ lỗi",
    intro: "Gửi file mô hình, ảnh lỗi và log chạy vào nhóm để được hỗ trợ gỡ lỗi và trao đổi cùng các học viên khác.",
    join: "Tham gia nhóm Zalo",
  },

  register: {
    title: "Đăng ký khóa học",
    intro: "Để lại thông tin, đơn vị sẽ tư vấn khóa học phù hợp với đề tài và kế hoạch học. Có thể gọi hoặc nhắn Zalo trực tiếp.",
    call: "Gọi tư vấn",
    zalo: "Nhắn Zalo",
    zaloNote: "Phản hồi trong giờ hành chính",
    mail: "Gửi email",
    instructor: "Giảng viên",
    unsure: "Chưa chắc, cần tư vấn",
    submit: "Đăng ký khóa học",
    sending: "Đang gửi…",
  },

  faq: {
    title: "Câu hỏi thường gặp",
    items: [
      { q: "Máy tính cần cấu hình thế nào để chạy FDS?", a: "FDS chạy tốt hơn với CPU nhiều nhân và RAM lớn. Với đồ án, nên có tối thiểu 16 GB RAM. Khóa học hướng dẫn chọn lưới để mô hình chạy được trên laptop." },
      { q: "Phần mềm có bản quyền không?", a: "FDS và Smokeview là phần mềm miễn phí của NIST. PyroSim và Pathfinder là phần mềm thương mại của Thunderhead Engineering. Khóa học hướng dẫn đăng ký bản dùng thử hoặc bản giáo dục theo chính sách của nhà phát hành." },
      { q: "Chưa biết gì về PCCC thì có học được không?", a: "Được. Khóa học đi từ khái niệm cơ bản như HRR, ASET, RSET đến thao tác phần mềm, và có bài viết trong thư viện để đọc trước." },
      { q: "Tài liệu trong thư viện có miễn phí không?", a: "Có. Công thức, bảng tính Excel và bài viết trong thư viện đều tải và sử dụng miễn phí." },
    ],
  },

  footer: {
    blurb: "Đào tạo và tư vấn mô phỏng cháy, thoát nạn theo QCVN 06, NFPA.",
    cols: {
      content: { title: "Nội dung", links: [["phan-mem", "Phần mềm"], ["de-tai", "Đề tài đồ án"], ["mo-phong", "Trình mô phỏng"], ["thu-vien", "Thư viện mở"]] },
      course: { title: "Khóa học", links: [["hoc-phi", "Học phí"], ["dang-ky", "Đăng ký"], ["hoi-dap", "Hỏi đáp"], ["zalo", "Nhóm Zalo"]] },
      contact: { title: "Liên hệ" },
    },
    legal: "PyroSim, Pathfinder là nhãn hiệu của Thunderhead Engineering. FDS, Smokeview do NIST phát triển.",
  },
} as const
