/*
 * NỘI DUNG CHỮ: tiêu đề, đoạn dẫn và nhãn nút của trang, gom về một chỗ để rà soát và thay.
 * Nguồn: tài liệu "FireTech – Nội dung web" (bản 2.0). Giọng học thuật, chính xác; giữ nguyên thuật ngữ
 * PyroSim, FDS, Pathfinder, Smokeview, ASET/RSET, HRR, QCVN 06, NFPA. Số liệu của từng dự án nằm ở
 * data/scenarios.ts và data/method.ts. Trang không ghi học phí.
 */
export const copy = {
  nav: [
    { id: "tin-tuc", label: "Tin tức" },
    { id: "mo-phong-chay", label: "Mô phỏng cháy" },
    { id: "cong-cu", label: "Công cụ" },
    { id: "tinh-huong", label: "Tình huống" },
    { id: "thu-vien", label: "Thư viện" },
    { id: "chung-toi", label: "Chúng tôi" },
    { id: "zalo", label: "Trao đổi" },
  ],
  cta: { consult: "Để lại thông tin", start: "Bắt đầu từ câu hỏi đầu tiên", scenarios: "Xem các tình huống mô phỏng" },

  news: {
    tickerLabel: "Tin mới",
    tickerRegion: "Tin mới cập nhật",
    pause: "Tạm dừng",
    play: "Phát",
    title: "Tin cập nhật",
    intro: "Tin mới nhất về an toàn cháy, thoát nạn và mô phỏng. Bấm vào một tin để đọc bài đầy đủ.",
    all: "Xem tất cả tin",
    read: "Đọc tiếp",
    latest: "Mới nhất",
  },

  hero: {
    eyebrow: "Kiến thức mở về an toàn cháy và thoát nạn",
    title: "Khi đám cháy xảy ra trong công trình, chuyện gì thực sự diễn ra?",
    lead: "FireTech E&C quy tụ các kiến trúc sư, kỹ sư PCCC và chuyên gia trực tiếp thực hiện các dự án mô phỏng cháy – thoát nạn. Tại đây, chúng tôi hệ thống lại những kiến thức rút ra từ thực tế: khói và nhiệt lan truyền ra sao, con người phản ứng thế nào, và vì sao một kết quả tính toán có thể quyết định phương án an toàn của cả công trình.",
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
      lead: "Mô phỏng cháy là việc dựng một bản sao số của công trình, đặt vào đó một đám cháy giả định, rồi dùng máy tính xác định nhiệt, khói và dòng người thoát nạn diễn biến ra sao theo từng giây.",
      answersLabel: "Mô phỏng trả lời những câu hỏi mà bản vẽ thiết kế không thể trả lời:",
      answers: ["Khói lan tới đâu và sau bao lâu?", "Người trong công trình có đủ thời gian để thoát ra ngoài an toàn hay không?", "Hệ thống thoát khói đã đáp ứng yêu cầu hay cần điều chỉnh?"],
      clocksLabel: "Hai đại lượng then chốt của mọi đánh giá:",
      clocks: [
        { term: "ASET", text: "(thời gian an toàn sẵn có) là khoảng thời gian từ lúc xảy ra cháy đến khi điều kiện trong công trình trở nên nguy hiểm với con người: nhiệt độ quá cao, tầm nhìn suy giảm hoặc khí độc vượt ngưỡng." },
        { term: "RSET", text: "(thời gian thoát nạn cần thiết) là khoảng thời gian con người cần để nhận biết đám cháy, chuẩn bị và di chuyển tới nơi an toàn." },
      ],
      closing: "Công trình được đánh giá là an toàn khi ASET lớn hơn RSET kèm một hệ số dự phòng, thường lấy bằng 1,5. Về bản chất, mọi bài toán mô phỏng cháy đều quy về phép so sánh giữa hai khoảng thời gian này.",
    },
    q2: {
      title: "Công cụ bấm nút hay làm chủ con số?",
      lead: "Phần mềm chỉ thực hiện phép tính. Độ tin cậy của kết quả phụ thuộc vào những giả định đầu vào do người kỹ sư thiết lập:",
      items: [
        { term: "Đám cháy giả định", text: "vị trí, quy mô và tốc độ phát triển của đám cháy. Chỉ cần thay đổi một trong các yếu tố này, kết luận có thể khác hẳn." },
        { term: "Con người", text: "tốc độ di chuyển và thời gian phản ứng sau khi có báo động. Người thông thuộc công trình và người lần đầu đến phản ứng rất khác nhau." },
        { term: "Tiêu chí chịu đựng", text: "ngưỡng nhiệt độ, nhiệt bức xạ, tầm nhìn và nồng độ khí độc được coi là không còn an toàn với con người." },
        { term: "Lưới tính và kiểm tra", text: "kích thước ô lưới tính toán và việc đối chiếu kết quả với dữ liệu thực nghiệm, tài liệu chuẩn." },
      ],
      closing: "Người kỹ sư làm chủ mô phỏng không chỉ chạy ra kết quả, mà còn giải thích được vì sao kết quả lại như vậy.",
    },
    q3: {
      title: "Nhìn thấy công trình vận hành khi có cháy",
      lead: "Mô phỏng biến các con số thành hình ảnh trực quan, giúp người xem thấy công trình “vận hành” khi có cháy. Video và hình ảnh dưới đây lấy từ một dự án chung cư cao tầng: đám cháy bùng phát tại khu sinh hoạt chung, khói lan lên hành lang các tầng và cư dân thoát nạn qua cầu thang bộ.",
      items: [
        { slot: "concepts-smoke", label: "Khói", text: "Cột khói bốc lên từ đám cháy tại khu sinh hoạt chung." },
        { slot: "concepts-visibility", label: "Tầm nhìn", text: "Mặt cắt cho thấy hành lang nào đã bị khói che khuất." },
        { slot: "concepts-crowd", label: "Dòng người", text: "Cư dân dồn về cầu thang bộ, chỗ nào ùn tắc." },
        { slot: "concepts-density", label: "Mật độ người", text: "Theo dõi số người còn lại trên tầng đến khi sơ tán hết." },
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
          "Nhập hình học từ IFC file và chuyển thành hình học dùng được cho mô phỏng cháy.",
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
    intro: "Năm tình huống được chọn lọc từ các dự án thực tế do đội ngũ FireTech E&C trực tiếp thực hiện, trình bày ở mức khái quát để người đọc nắm được cách đặt vấn đề và những bài học rút ra.",
    overviewContent: "Nội dung mô phỏng chính",
    overviewConclusion: "Kết luận chính",
    context: "Bối cảnh",
    simulation: "Nội dung mô phỏng",
    observations: "Kết quả quan sát",
    lessons: "Bài học rút ra",
    extra: "Bài học bổ sung",
    methodTitle: "Phương pháp đánh giá chung",
    criteriaTitle: "Tiêu chí an toàn đối với con người",
    safetyFactor: "Hệ số an toàn",
    references: "Tài liệu tham chiếu chính",
    software: "Phần mềm",
  },

  topics: {
    title: "Đề tài nghiên cứu khoa học cho sinh viên",
    intro: "Gợi ý các đề tài nghiên cứu khoa học thuộc lĩnh vực PCCC và Kiến trúc có thể thực hiện với PyroSim, FDS, Pathfinder, kèm kết quả cần đạt và tiêu chuẩn tham chiếu.",
    filters: { field: "Lĩnh vực", tool: "Phần mềm", all: "Tất cả" },
    copy: "Sao chép gợi ý",
    enroll: "Trao đổi về đề tài này",
    none: "Không có đề tài phù hợp, hãy đổi bộ lọc.",
    prefix: "Quan tâm đề tài: ",
    standards: "Tiêu chuẩn: ",
    outcomes: "Kết quả cần đạt",
  },

  library: {
    title: "Thư viện mở",
    intro: "Kho tài liệu dành cho sinh viên, nhà nghiên cứu và kỹ sư trẻ, miễn phí và không cần đăng nhập: bài viết giải thích, bảng tính Excel, mẫu kịch bản cháy kèm checklist kiểm tra mô hình, và danh mục tiêu chuẩn.",
    search: "Tìm bài viết, bảng tính, tiêu chuẩn…",
    topicsTab: "Đề tài NCKH",
    empty: "Không có tài liệu phù hợp. Hãy thử từ khóa khác hoặc xóa bộ lọc.",
    standardNote: "Trang chỉ nêu tên và phạm vi của tiêu chuẩn. Hãy đọc bản chính thức khi áp dụng.",
  },

  about: {
    label: "Chúng tôi là ai",
    title: "Hiểu đúng đám cháy, thiết kế đúng lối thoát",
    lead: "FireTech E&C là nền tảng tri thức mở và cộng đồng chuyên gia độc lập về Kỹ thuật An toàn Cháy và Mô phỏng Thoát nạn (FSE) tại Việt Nam. Nền tảng được khởi xướng bởi các kiến trúc sư, kỹ sư PCCC và chuyên gia mô phỏng động lực học cháy (CFD/FDS) đã trực tiếp tham gia các dự án hạ tầng ngầm, công trình công nghiệp và dân dụng quy mô lớn, với mong muốn kết nối người làm nghề, nhà nghiên cứu và thế hệ kỹ sư trẻ.",
    doTitle: "Mục đích hoạt động",
    does: [
      "Xây dựng thư viện tri thức mở: hệ thống hóa, biên dịch và phổ biến dữ liệu nghiên cứu từ NIST, SFPE, UL FSRI, NFPA cùng các hệ tiêu chuẩn kỹ thuật (QCVN 06, GOST/MChS, BS, MLIT).",
      "Kết nối và lan tỏa năng lực chuyên gia: tạo không gian trao đổi học thuật, phản biện kịch bản kỹ thuật và cùng giải quyết những bài toán khó.",
      "Chuẩn hóa kỹ năng thực hành: cung cấp tài liệu hướng dẫn, bộ kịch bản mẫu, bảng tra cứu và quy trình xử lý dữ liệu từ CAD/BIM sang môi trường mô phỏng.",
    ],
    mission: { label: "Sứ mệnh", text: "Khai phóng tri thức mô phỏng, kiến tạo chuẩn mực an toàn công trình." },
    vision: { label: "Tầm nhìn", text: "Trở thành trung tâm tri thức mở và diễn đàn chuyên môn uy tín về FSE tại Việt Nam, là điểm tựa nối kỹ sư trong nước với các chuẩn mực và dữ liệu nghiên cứu tiên tiến của thế giới." },
    valuesTitle: "Giá trị cốt lõi",
    values: [
      { term: "Chia sẻ phi lợi nhuận", text: "tri thức và dữ liệu nghiên cứu nền tảng được phân loại, xử lý và chia sẻ công khai vì sự phát triển chung của cộng đồng." },
      { term: "Độ tin cậy khoa học", text: "công thức, hệ số, tốc độ phát triển cháy và hồ sơ thoát nạn đều dẫn nguồn rõ ràng từ các viện nghiên cứu và quy chuẩn được công nhận." },
      { term: "Đồng hành chuyên gia", text: "người đi trước hỗ trợ, giải đáp và phản biện kỹ thuật cho kỹ sư trẻ trong việc gỡ lỗi mô hình và hoàn thiện báo cáo an toàn cháy." },
    ],
  },

  zalo: {
    title: "Trao đổi cùng chúng tôi",
    quote: "Cùng nhau gỡ từng bài toán khó.",
    intro: "Nhóm Zalo là không gian trao đổi học thuật: hỏi đáp, cùng phản biện kịch bản, gỡ lỗi mô hình và chia sẻ kinh nghiệm thực tế. Nhóm mở cho tất cả mọi người, từ sinh viên đến kỹ sư đang hành nghề.",
    join: "Tham gia nhóm Zalo",
  },

  register: {
    title: "Để lại thông tin",
    intro: "Nếu bạn có câu hỏi chuyên môn hoặc muốn trao đổi sâu hơn về một bài toán mô phỏng, hãy để lại thông tin. Chúng tôi sẽ liên hệ lại để trao đổi cụ thể.",
    call: "Gọi trực tiếp",
    zalo: "Nhắn Zalo",
    zaloNote: "Phản hồi trong giờ hành chính",
    mail: "Gửi email",
    submit: "Gửi thông tin",
    sending: "Đang gửi…",
    noteLabel: "Bạn muốn trao đổi điều gì?",
  },

  footer: {
    blurb: "Kiến thức mở về an toàn cháy và mô phỏng thoát nạn tại Việt Nam.",
    cols: {
      content: { title: "Nội dung", links: [["mo-phong-chay", "Mô phỏng cháy là gì?"], ["cong-cu", "Công cụ"], ["tinh-huong", "Tình huống mô phỏng"], ["thu-vien", "Thư viện mở"], ["tin-tuc/", "Tin tức"]] },
      about: { title: "Cùng trao đổi", links: [["chung-toi", "Chúng tôi là ai"], ["zalo", "Nhóm Zalo"], ["dang-ky", "Để lại thông tin"]] },
      contact: { title: "Liên hệ" },
    },
    legal: "PyroSim, Pathfinder là nhãn hiệu của Thunderhead Engineering. FDS, Smokeview do NIST phát triển.",
  },
} as const
