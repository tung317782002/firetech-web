/*
 * NỘI DUNG CHỮ: tiêu đề, đoạn dẫn và nhãn nút của trang, gom về một chỗ để rà soát và thay.
 * Nguồn: tài liệu "FireTech – Nội dung web" (bản 2.0). Giọng học thuật, chính xác; giữ nguyên thuật ngữ
 * PyroSim, FDS, Pathfinder, Smokeview, ASET/RSET, HRR, QCVN 06, NFPA. Số liệu của từng dự án nằm ở
 * data/scenarios.ts và data/method.ts. Trang không ghi học phí.
 */
export const copy = {
  nav: [
    { id: "mo-phong-chay", label: "Mô phỏng cháy" },
    { id: "cong-cu", label: "Công cụ" },
    { id: "tinh-huong", label: "Tình huống" },
    { id: "thu-vien", label: "Thư viện" },
    { id: "chung-toi", label: "Chúng tôi" },
    { id: "zalo", label: "Trao đổi" },
  ],
  cta: { consult: "Để lại thông tin", start: "Bắt đầu từ câu hỏi đầu tiên", scenarios: "Xem các tình huống mô phỏng" },

  hero: {
    eyebrow: "Kiến thức mở về an toàn cháy và thoát nạn",
    title: "Khi đám cháy xảy ra trong công trình, chuyện gì thực sự diễn ra?",
    lead: "Chúng tôi là nhóm kiến trúc sư và kỹ sư PCCC làm mô phỏng cháy mỗi ngày. Ở đây, chúng tôi kể lại những gì mình học được: lửa và khói đi như thế nào, con người thoát ra sao, và vì sao một con số trên màn hình có thể quyết định một lối thoát nạn.",
    questionsLabel: "Ba câu hỏi dẫn vào nội dung",
    questions: [
      { id: "cau-hoi-1", text: "Thế nào là mô phỏng cháy?" },
      { id: "cau-hoi-2", text: "Phần mềm chỉ là công cụ bấm nút, hay bạn đang thực sự làm chủ các con số và cơ sở vật lý phía sau?" },
      { id: "cau-hoi-3", text: "Làm sao nhìn thấy một công trình “vận hành” khi có cháy, một cách trực quan?" },
    ],
  },

  tools: { label: "Phần mềm và tiêu chuẩn", items: ["PyroSim", "FDS", "Pathfinder", "Smokeview", "QCVN 06", "NFPA 101", "NFPA 92"] },

  concepts: {
    title: "Mô phỏng cháy là gì?",
    q1: {
      title: "Thế nào là mô phỏng cháy?",
      lead: "Mô phỏng cháy là dựng một bản sao số của công trình, đặt một đám cháy giả định vào đó, rồi để máy tính tính xem nhiệt, khói và con người sẽ chuyển động thế nào theo từng giây.",
      answersLabel: "Nó trả lời những câu hỏi mà bản vẽ không trả lời được:",
      answers: ["Khói lan đến đâu, sau bao lâu?", "Người trong nhà có đủ thời gian để thoát ra không?", "Hệ thống thoát khói đã đủ chưa, hay cần chỉnh?"],
      clocksLabel: "Hai đồng hồ quyết định mọi thứ:",
      clocks: [
        { term: "ASET", text: "là thời gian từ lúc cháy đến khi điều kiện trong nhà trở nên nguy hiểm với con người (quá nóng, hết tầm nhìn, khí độc)." },
        { term: "RSET", text: "là thời gian người cần để nhận ra cháy, chuẩn bị và đi ra nơi an toàn." },
      ],
      closing: "Công trình đạt yêu cầu khi ASET lớn hơn RSET với một hệ số dự phòng. Trong thực hành, nhiều báo cáo dùng hệ số 1,5 lần. Toàn bộ mô phỏng thực chất là cuộc chạy đua giữa hai đồng hồ này.",
    },
    q2: {
      title: "Công cụ bấm nút hay làm chủ con số?",
      lead: "Phần mềm chỉ cho ra kết quả đẹp. Kết quả có đáng tin hay không phụ thuộc vào những thứ nằm ngoài nút bấm:",
      items: [
        { term: "Đám cháy giả định", text: "cháy ở đâu, to cỡ nào, phát triển nhanh ra sao. Chọn khác đi là ra một kết luận khác." },
        { term: "Con người", text: "họ đi nhanh hay chậm, bao lâu mới bắt đầu di chuyển sau khi nghe báo động. Người quen và người lạ công trình phản ứng rất khác nhau." },
        { term: "Tiêu chí chịu đựng", text: "nhiệt độ, nhiệt bức xạ, tầm nhìn và khí CO đến mức nào thì coi là không an toàn." },
        { term: "Lưới tính và kiểm tra", text: "chia lưới thô hay mịn, đã kiểm chứng kết quả với tài liệu chuẩn chưa." },
      ],
      closing: "Một kỹ sư làm chủ mô phỏng là người giải thích được vì sao con số ra như vậy, chứ không chỉ chạy ra được con số.",
    },
    q3: {
      title: "Nhìn thấy công trình vận hành khi có cháy",
      lead: "Mô phỏng biến những con số thành hình ảnh có thể xem được:",
      items: [
        { slot: "concepts-smoke", text: "Khói tràn xuống dần từ trần, lấn mất tầm nhìn." },
        { slot: "concepts-heatmap", text: "Bản đồ nhiệt: chỗ nào nóng, chỗ nào còn an toàn." },
        { slot: "concepts-crowd", text: "Dòng người dồn về cửa thoát nạn, chỗ nào ùn lại, bao lâu thì hết người." },
        { slot: "concepts-counter", text: "Đồng hồ đếm số người đã ra ngoài, ví dụ 176/188 người ở giây thứ 138." },
      ],
    },
    figureNote: "Hình gợi ý: sơ đồ so sánh ASET và RSET",
  },

  software: {
    title: "Công cụ",
    intro: "Mỗi phần mềm trả lời một câu hỏi khác nhau. Kết quả của chúng ghép lại thành phép đối chiếu ASET với RSET.",
    items: [
      {
        slot: "software-fds",
        tag: "Mô phỏng cháy",
        tone: "ember",
        name: "FDS (Fire Dynamics Simulator) và Smokeview",
        paras: [
          "FDS là mô hình động lực học chất lưu (CFD) dành cho dòng chảy do cháy sinh ra, tập trung vào sự di chuyển của khói và nhiệt. Nó chia không gian thành lưới ba chiều rồi tính từng bước thời gian. FDS do NIST (Mỹ) phát triển và duy trì.",
          "Smokeview đi kèm FDS, biến kết quả tính thành hình ảnh và hoạt ảnh lửa, khói. Nhờ đó, người xem đánh giá được tầm nhìn trong không gian có cháy.",
        ],
        points: [] as string[],
      },
      {
        slot: "software-pyrosim",
        tag: "Giao diện dựng mô hình",
        tone: "ink",
        name: "PyroSim",
        paras: ["PyroSim là giao diện đồ hoạ cho FDS. Thay vì viết tay file đầu vào dạng chữ, người dùng dựng mô hình bằng hình ảnh trực quan rồi để phần mềm tự sinh file cho FDS."],
        points: [
          "Nhập hình học từ CAD hoặc BIM và chuyển thành hình học dùng được cho mô phỏng cháy.",
          "Thiết kế mô phỏng bằng đồ hoạ, có báo lỗi ngay khi làm để giảm sai sót.",
          "Quản lý tài nguyên máy tính, tạo nhiều cấu hình để phân tích độ nhạy.",
          "Xuất biểu đồ và video kết quả có lớp thông tin chồng lên.",
          "Người dùng: kỹ sư PCCC, đơn vị thiết kế theo hiệu năng và cả cơ quan thẩm định.",
        ],
      },
      {
        slot: "software-pathfinder",
        tag: "Mô phỏng thoát nạn",
        tone: "teal",
        name: "Pathfinder",
        paras: [
          "Pathfinder mô phỏng chuyển động của đám đông và việc thoát hiểm, trong nhà lẫn ngoài trời. Mỗi người trong mô hình là một “tác tử” có tốc độ, vị trí, thời gian phản ứng riêng, tự thích ứng khi cửa, tín hiệu hoặc biển báo thay đổi.",
        ],
        points: [
          "Mô phỏng nhóm người và hành vi phức tạp.",
          "Chạy nhiều lần với điều kiện ban đầu ngẫu nhiên để xem mức dao động.",
          "Kết quả cho ra thời gian cần để cả công trình thoát hết (RSET).",
          "Người dùng: chuyên gia an toàn tính mạng, quản lý sự kiện, đơn vị ứng phó khẩn cấp.",
        ],
      },
    ],
    together: {
      title: "Ba công cụ phối hợp thế nào",
      text: "FDS (qua PyroSim) cho ra ASET, Pathfinder cho ra RSET. Đặt hai kết quả cạnh nhau là biết công trình có an toàn hay không.",
    },
  },

  scenarios: {
    title: "Tình huống mô phỏng",
    intro: "Tóm tắt năm tình huống mô phỏng được chọn lọc từ báo cáo chi tiết của các dự án thực tế mà đội ngũ FireTech đã trực tiếp thực hiện.",
    overviewContent: "Nội dung mô phỏng chính",
    overviewConclusion: "Kết luận chính",
    context: "Bối cảnh",
    simulation: "Nội dung mô phỏng",
    observations: "Kết quả quan sát",
    lessons: "Bài học rút ra",
    extra: "Bài học bổ sung",
    basis: "Cơ sở tính toán áp dụng",
    mediaLabel: "Hình ảnh và video của tình huống",
    methodTitle: "Phương pháp đánh giá chung",
    criteriaTitle: "Tiêu chí an toàn đối với con người",
    safetyFactor: "Hệ số an toàn",
    references: "Tài liệu tham chiếu chính",
    software: "Phần mềm",
  },

  topics: {
    title: "Đề tài đồ án gợi ý",
    intro: "Các đề tài PCCC và Kiến trúc có thể thực hiện với PyroSim, FDS, Pathfinder, kèm kết quả cần đạt và tiêu chuẩn tham chiếu.",
    filters: { field: "Lĩnh vực", level: "Cấp", tool: "Phần mềm", all: "Tất cả" },
    copy: "Sao chép gợi ý",
    enroll: "Trao đổi về đề tài này",
    none: "Không có đề tài phù hợp, hãy đổi bộ lọc.",
    prefix: "Quan tâm đề tài: ",
    standards: "Tiêu chuẩn: ",
    outcomes: "Kết quả cần đạt",
  },

  library: {
    title: "Thư viện mở",
    intro: "Kho tài liệu dành cho sinh viên và kỹ sư trẻ làm đồ án, miễn phí và không cần đăng nhập: bài viết giải thích, bảng tính Excel, mẫu kịch bản cháy kèm checklist kiểm tra mô hình, và danh mục tiêu chuẩn.",
    search: "Tìm bài viết, bảng tính, tiêu chuẩn…",
    empty: "Không có tài liệu phù hợp. Hãy thử từ khóa khác hoặc xóa bộ lọc.",
    standardNote: "Trang chỉ nêu tên và phạm vi của tiêu chuẩn. Hãy đọc bản chính thức khi áp dụng.",
  },

  about: {
    label: "Chúng tôi là ai",
    title: "Những người làm mô phỏng cháy, kể lại điều mình học được",
    lead: "FireTech là nơi chia sẻ kiến thức về an toàn cháy và mô phỏng thoát nạn tại Việt Nam, do các kiến trúc sư, kỹ sư PCCC và chuyên gia mô phỏng CFD/FDS khởi xướng. Chúng tôi từng tham gia các dự án hạ tầng ngầm, công trình công nghiệp và dân dụng lớn, và muốn nối người làm nghề, nhà nghiên cứu với các bạn kỹ sư trẻ.",
    doTitle: "Chúng tôi làm gì",
    does: [
      "Dịch và hệ thống lại tài liệu từ NIST, SFPE, NFPA và các tiêu chuẩn kỹ thuật (QCVN 06 và các hệ khác) cho dễ tiếp cận.",
      "Chia sẻ cách làm: quy trình đưa mô hình từ CAD/BIM vào môi trường mô phỏng, bộ kịch bản mẫu, bảng tra cứu.",
      "Tạo chỗ để cùng phản biện kịch bản và gỡ lỗi mô hình.",
    ],
    mission: { label: "Sứ mệnh", text: "Khai phóng tri thức mô phỏng, kiến tạo chuẩn mực an toàn công trình." },
    vision: { label: "Tầm nhìn", text: "Trở thành điểm tựa tri thức mở về an toàn cháy tại Việt Nam, nối kỹ sư trong nước với chuẩn mực và dữ liệu nghiên cứu của thế giới." },
    valuesTitle: "Giá trị cốt lõi",
    values: [
      { term: "Mở và miễn phí", text: "kiến thức nền được chia sẻ công khai." },
      { term: "Chính xác", text: "công thức, hệ số, hồ sơ thoát nạn đều dẫn nguồn rõ ràng." },
      { term: "Đồng hành", text: "người đi trước kèm người đi sau, không để ai tự mò một mình." },
    ],
  },

  zalo: {
    title: "Trao đổi cùng chúng tôi",
    quote: "Cùng nhau gỡ từng bài toán khó.",
    intro: "Nhóm Zalo là nơi hỏi đáp, xem lại mô hình của nhau và chia sẻ kinh nghiệm làm việc thực tế. Ai cũng được tham gia, từ sinh viên năm cuối đến kỹ sư đi làm.",
    join: "Tham gia nhóm Zalo",
  },

  register: {
    title: "Để lại thông tin",
    intro: "Nếu bạn muốn hiểu sâu hơn hoặc cần đồng hành lâu hơn, hãy để lại thông tin. Chúng tôi sẽ nhắn lại và trao đổi cụ thể với bạn.",
    call: "Gọi trực tiếp",
    zalo: "Nhắn Zalo",
    zaloNote: "Phản hồi trong giờ hành chính",
    mail: "Gửi email",
    instructor: "Người trao đổi cùng bạn",
    submit: "Gửi thông tin",
    sending: "Đang gửi…",
    noteLabel: "Bạn muốn trao đổi điều gì?",
  },

  footer: {
    blurb: "Kiến thức mở về an toàn cháy và mô phỏng thoát nạn tại Việt Nam.",
    cols: {
      content: { title: "Nội dung", links: [["mo-phong-chay", "Mô phỏng cháy là gì?"], ["cong-cu", "Công cụ"], ["tinh-huong", "Tình huống mô phỏng"], ["thu-vien", "Thư viện mở"]] },
      about: { title: "Cùng trao đổi", links: [["chung-toi", "Chúng tôi là ai"], ["zalo", "Nhóm Zalo"], ["dang-ky", "Để lại thông tin"]] },
      contact: { title: "Liên hệ" },
    },
    legal: "PyroSim, Pathfinder là nhãn hiệu của Thunderhead Engineering. FDS, Smokeview do NIST phát triển.",
  },
} as const
