/*
 * DỮ LIỆU NỘI DUNG: đề tài đồ án, thư viện tài liệu, bài viết.
 * Thêm/sửa/xoá phần tử trong các mảng dưới đây, trang sẽ tự cập nhật (kể cả bộ lọc và số liệu thống kê).
 */
window.FIRETECH_DATA = (function () {
  "use strict";

  /* ---------------------------------------------------------------- Đề tài gợi ý */
  var topics = [
    {
      id: "khoi-ham-do-xe",
      title: "Mô phỏng lan truyền khói trong tầng hầm đỗ xe và đánh giá hệ thống hút khói",
      field: "PCCC",
      level: "Đồ án tốt nghiệp",
      tools: ["PyroSim", "FDS"],
      summary: "Dựng một tầng hầm điển hình, đặt đám cháy xe con và so sánh các phương án quạt hút/quạt jet fan theo tầm nhìn và nhiệt độ.",
      outcomes: ["Đường cong HRR cho xe con", "Bản đồ tầm nhìn theo thời gian", "So sánh 2–3 phương án hút khói"],
      standards: "QCVN 06:2022/BXD, NFPA 92"
    },
    {
      id: "rset-trung-tam-thuong-mai",
      title: "Đánh giá thời gian thoát nạn RSET của trung tâm thương mại theo các phương án bố trí cửa và thang",
      field: "PCCC",
      level: "Đồ án tốt nghiệp",
      tools: ["Pathfinder"],
      summary: "Mô phỏng hàng nghìn người di chuyển, thay đổi số lượng và vị trí lối ra để tìm điểm nghẽn và RSET lớn nhất.",
      outcomes: ["RSET từng phương án", "Bản đồ mật độ người", "Đề xuất điều chỉnh lối thoát nạn"],
      standards: "QCVN 06:2022/BXD, NFPA 101"
    },
    {
      id: "thang-bo-chung-cu",
      title: "Kiểm tra ASET/RSET cho chung cư cao tầng: thang bộ thoát nạn và hành lang chung",
      field: "PCCC",
      level: "Luận văn thạc sĩ",
      tools: ["PyroSim", "FDS", "Pathfinder"],
      summary: "Kết hợp kết quả khói từ FDS với thoát nạn từ Pathfinder để chứng minh ASET lớn hơn RSET kèm hệ số an toàn.",
      outcomes: ["Kịch bản cháy tại căn hộ và hành lang", "ASET theo tầm nhìn/nhiệt độ", "Biên an toàn ASET so với RSET"],
      standards: "QCVN 06:2022/BXD, NFPA 101"
    },
    {
      id: "atrium-thoat-khoi",
      title: "Thiết kế giếng trời (atrium) kết hợp thoát khói tự nhiên trong trung tâm hội nghị",
      field: "Kiến trúc",
      level: "Đồ án tốt nghiệp",
      tools: ["PyroSim", "FDS"],
      summary: "Khảo sát ảnh hưởng chiều cao, diện tích cửa mái và vị trí cửa bù khí đến lớp khói trong không gian rỗng lớn.",
      outcomes: ["Chiều cao lớp khói theo thời gian", "So sánh diện tích cửa thoát khói", "Hiệu chỉnh giải pháp kiến trúc"],
      standards: "NFPA 92, QCVN 06:2022/BXD"
    },
    {
      id: "hanh-lang-truong-hoc",
      title: "Tối ưu bố trí hành lang và cầu thang trường học theo kịch bản thoát nạn giờ ra chơi",
      field: "Kiến trúc",
      level: "Đồ án môn học",
      tools: ["Pathfinder"],
      summary: "So sánh hành lang giữa và hành lang bên, vị trí cầu thang, bề rộng cửa phòng học với tình huống đông học sinh.",
      outcomes: ["RSET theo từng phương án mặt bằng", "Điểm nghẽn tại chân cầu thang", "Khuyến nghị bề rộng tối thiểu"],
      standards: "QCVN 06:2022/BXD, NFPA 101"
    },
    {
      id: "kho-xep-gia",
      title: "Mô phỏng cháy kho hàng xếp giá cao: ảnh hưởng của đầu phun sprinkler đến đường cong HRR",
      field: "PCCC",
      level: "Luận văn thạc sĩ",
      tools: ["PyroSim", "FDS"],
      summary: "Mô hình đầu phun, RTI và nhiệt độ kích hoạt, đánh giá khả năng khống chế đám cháy với các mật độ phun khác nhau.",
      outcomes: ["Thời điểm kích hoạt sprinkler", "HRR có/không có sprinkler", "Phân tích độ nhạy theo RTI"],
      standards: "NFPA 13, NFPA 72"
    },
    {
      id: "be-rong-loi-thoat",
      title: "Ảnh hưởng của bề rộng lối thoát nạn đến lưu lượng dòng người qua cửa",
      field: "Kiến trúc",
      level: "Đồ án môn học",
      tools: ["Pathfinder"],
      summary: "Chạy chuỗi mô phỏng thay đổi bề rộng cửa từ 0,9 m đến 2,4 m, vẽ quan hệ giữa bề rộng và lưu lượng riêng.",
      outcomes: ["Biểu đồ lưu lượng theo bề rộng", "So sánh với công thức SFPE", "Nhận xét ngưỡng hiệu quả"],
      standards: "NFPA 101, SFPE Handbook"
    },
    {
      id: "sfpe-so-voi-steering",
      title: "So sánh hai chế độ di chuyển SFPE và Steering trong Pathfinder trên cùng một công trình",
      field: "PCCC",
      level: "Luận văn thạc sĩ",
      tools: ["Pathfinder"],
      summary: "Phân tích khác biệt về RSET, mật độ và hành vi tránh va chạm giữa hai chế độ, đánh giá độ nhạy tham số.",
      outcomes: ["RSET hai chế độ", "Đánh giá độ nhạy tham số", "Khuyến nghị chọn chế độ theo bài toán"],
      standards: "SFPE Handbook, hướng dẫn kỹ thuật Pathfinder"
    },
    {
      id: "revit-sang-mo-phong",
      title: "Quy trình từ mô hình BIM Revit sang mô phỏng cháy và thoát nạn: chuẩn hóa dữ liệu đầu vào",
      field: "Kiến trúc",
      level: "Luận văn thạc sĩ",
      tools: ["PyroSim", "FDS", "Pathfinder"],
      summary: "Xây dựng quy tắc đơn giản hóa mô hình, đặt tên đối tượng và xuất file để rút ngắn thời gian dựng mô hình mô phỏng.",
      outcomes: ["Checklist chuẩn hóa mô hình Revit", "Đo thời gian dựng trước/sau", "Quy trình áp dụng cho dự án thực"],
      standards: "Hướng dẫn BIM của dự án, tài liệu phần mềm"
    }
  ];

  /* ---------------------------------------------------------------- Công cụ tính nhanh */
  // Làm tròn d chữ số thập phân và định dạng kiểu Việt Nam (dấu phẩy thập phân).
  function round(v, d) {
    var k = Math.pow(10, d);
    var r = Math.round(v * k) / k;
    try { return r.toLocaleString("vi-VN", { maximumFractionDigits: d }); } catch (e) { return String(r); }
  }

  var calcs = {
    hrr: {
      inputs: [
        {
          id: "alpha", label: "Tốc độ phát triển đám cháy", type: "select", value: "0.0469",
          options: [
            { v: "0.00293", t: "Chậm (α = 0,00293)" },
            { v: "0.01172", t: "Trung bình (α = 0,01172)" },
            { v: "0.0469", t: "Nhanh (α = 0,0469)" },
            { v: "0.1876", t: "Rất nhanh (α = 0,1876)" }
          ]
        },
        { id: "t", label: "Thời gian t", unit: "s", value: 120, min: 0, step: 10 }
      ],
      run: function (v) {
        var q = v.alpha * v.t * v.t;
        return [
          { label: "Q", value: round(q, 1) + " kW" },
          { label: "Q", value: round(q / 1000, 3) + " MW" }
        ];
      }
    },
    dstar: {
      inputs: [{ id: "q", label: "Công suất cháy Q", unit: "kW", value: 1000, min: 1, step: 100 }],
      run: function (v) {
        // ρ∞ = 1,204 kg/m³; cp = 1,005 kJ/(kg·K); T∞ = 293 K; g = 9,81 m/s²
        var d = Math.pow(v.q / (1.204 * 1.005 * 293 * Math.sqrt(9.81)), 0.4);
        return [
          { label: "D*", value: round(d, 3) + " m" },
          { label: "dx (D*/16 → D*/4)", value: round(d / 16, 3) + " m → " + round(d / 4, 3) + " m" }
        ];
      }
    },
    rset: {
      inputs: [
        { id: "det", label: "Phát hiện cháy", unit: "s", value: 30, min: 0, step: 5 },
        { id: "alarm", label: "Báo động", unit: "s", value: 15, min: 0, step: 5 },
        { id: "pre", label: "Nhận biết + phản ứng", unit: "s", value: 60, min: 0, step: 5 },
        { id: "travel", label: "Di chuyển (từ Pathfinder)", unit: "s", value: 90, min: 0, step: 5 },
        { id: "aset", label: "ASET (từ FDS)", unit: "s", value: 300, min: 0, step: 10 },
        { id: "k", label: "Hệ số an toàn", unit: "×", value: 1.5, min: 1, step: 0.1 }
      ],
      run: function (v) {
        var rset = v.det + v.alarm + v.pre + v.travel;
        var margin = v.aset - v.k * rset;
        return [
          { label: "RSET", value: round(rset, 1) + " s" },
          { label: "k × RSET", value: round(v.k * rset, 1) + " s" },
          { label: "Kết luận", value: margin >= 0 ? "ASET ≥ k × RSET (đạt, dư " + round(margin, 1) + " s)" : "ASET < k × RSET (chưa đạt, thiếu " + round(-margin, 1) + " s)", status: margin >= 0 ? "ok" : "bad" }
        ];
      }
    },
    flow: {
      inputs: [{ id: "d", label: "Mật độ người D", unit: "người/m²", value: 1.5, min: 0, max: 3.7, step: 0.1 }],
      run: function (v) {
        var s = Math.max(0, 1.4 * (1 - 0.266 * v.d));
        return [
          { label: "Vận tốc S", value: round(s, 3) + " m/s" },
          { label: "Lưu lượng riêng Fs", value: round(s * v.d, 3) + " người/(m·s)" }
        ];
      }
    },
    vis: {
      inputs: [
        {
          id: "c", label: "Loại vật thể quan sát", type: "select", value: "3",
          options: [{ v: "3", t: "Biển hiệu phát sáng (C = 3)" }, { v: "8", t: "Vật phản xạ ánh sáng (C = 8)" }]
        },
        { id: "k", label: "Hệ số tắt dần K", unit: "1/m", value: 0.3, min: 0.001, step: 0.05 }
      ],
      run: function (v) {
        return [{ label: "Tầm nhìn S", value: round(v.c / v.k, 2) + " m" }];
      }
    }
  };

  /* ---------------------------------------------------------------- Thư viện tài liệu mở */
  var docs = [
    {
      id: "ct-hrr", type: "formula", title: "Đường cong phát triển cháy t²",
      desc: "Công suất cháy tăng theo bình phương thời gian, dùng để dựng đường cong HRR khi thiếu số liệu thí nghiệm.",
      tags: ["FDS", "Khói & nhiệt"], formula: "Q = α · t²", note: "Q (kW), t (s). α: chậm 0,00293 · trung bình 0,01172 · nhanh 0,0469 · rất nhanh 0,1876 kW/s².", calc: "hrr"
    },
    {
      id: "ct-dstar", type: "formula", title: "Đường kính đám cháy đặc trưng D* và kích thước ô lưới",
      desc: "Cơ sở chọn ô lưới FDS: tỉ số D*/dx thường nằm trong khoảng 4 đến 16.",
      tags: ["FDS"], formula: "D* = ( Q / (ρ∞ · cp · T∞ · √g) )^(2/5)", note: "ρ∞ = 1,204 kg/m³; cp = 1,005 kJ/(kg·K); T∞ = 293 K; g = 9,81 m/s².", calc: "dstar"
    },
    {
      id: "ct-rset", type: "formula", title: "Thời gian thoát nạn cần thiết RSET và điều kiện ASET > RSET",
      desc: "Cộng các thành phần thời gian rồi đối chiếu với thời gian thoát nạn an toàn ASET kèm hệ số an toàn.",
      tags: ["Thoát nạn", "Pathfinder"], formula: "RSET = t_phát hiện + t_báo động + t_trì hoãn + t_di chuyển\nASET ≥ k · RSET", note: "Hệ số k do tiêu chuẩn áp dụng hoặc cơ quan thẩm duyệt quy định.", calc: "rset"
    },
    {
      id: "ct-flow", type: "formula", title: "Vận tốc và lưu lượng dòng người theo mật độ (SFPE)",
      desc: "Quan hệ vận tốc đi bộ với mật độ người trên lối đi bằng phẳng, dùng để kiểm tra kết quả Pathfinder.",
      tags: ["Thoát nạn", "Pathfinder"], formula: "S = k · (1 − 0,266 · D)\nFs = S · D", note: "k = 1,4 m/s cho lối đi bằng phẳng; D (người/m²) từ 0 đến khoảng 3,7.", calc: "flow"
    },
    {
      id: "ct-vis", type: "formula", title: "Tầm nhìn xa trong khói",
      desc: "Quan hệ giữa tầm nhìn và hệ số tắt dần của khói, dùng để xác định tiêu chí ASET theo tầm nhìn.",
      tags: ["Khói & nhiệt", "FDS"], formula: "S = C / K", note: "K: hệ số tắt dần (1/m). C = 3 với biển hiệu phát sáng; C = 8 với vật phản xạ ánh sáng.", calc: "vis"
    },
    {
      id: "xl-hrr", type: "excel", title: "Bảng tính HRR theo đường cong t²",
      desc: "Nhập α và thời gian, bảng tự vẽ chuỗi Q theo thời gian để dán vào PyroSim.",
      tags: ["FDS", "Khói & nhiệt"], file: "assets/downloads/bang-tinh-hrr-t2.xlsx"
    },
    {
      id: "xl-rset", type: "excel", title: "Bảng tính RSET/ASET và hệ số an toàn",
      desc: "Nhập các thành phần thời gian, bảng tính RSET, so sánh ASET và đưa ra kết luận đạt/chưa đạt.",
      tags: ["Thoát nạn"], file: "assets/downloads/bang-tinh-rset-aset.xlsx"
    },
    {
      id: "xl-luoi", type: "excel", title: "Bảng tính D* và gợi ý kích thước ô lưới FDS",
      desc: "Nhập công suất cháy, nhận D* và dải dx tương ứng D*/4 đến D*/16, kèm kiểm tra số ô theo mesh.",
      tags: ["FDS"], file: "assets/downloads/bang-tinh-luoi-fds.xlsx"
    },
    {
      id: "xl-nguoi", type: "excel", title: "Bảng tính số người thoát nạn theo diện tích sàn",
      desc: "Nhập diện tích và hệ số m²/người của từng khu vực, bảng cộng tổng số người để đưa vào Pathfinder.",
      tags: ["Thoát nạn", "Pathfinder"], file: "assets/downloads/bang-tinh-so-nguoi.xlsx"
    },
    {
      id: "bv-luoi", type: "article", title: "Chọn kích thước ô lưới FDS: bắt đầu từ D*/dx",
      desc: "Quy trình ba bước chọn lưới và kiểm tra độ nhạy mà không làm tốn thời gian chạy.",
      tags: ["FDS"], read: "6 phút đọc",
      body: [
        "Lưới quá thô cho kết quả sai về hình dạng luồng khói, lưới quá mịn khiến thời gian chạy tăng rất nhanh. Cách làm phổ biến là bắt đầu từ đường kính đám cháy đặc trưng D*.",
        "Bước 1: tính D* từ công suất cháy lớn nhất Q (xem công thức trong thư viện). Bước 2: chọn dx sao cho D*/dx nằm trong khoảng 4 (lưới thô) đến 16 (lưới mịn). Với đồ án, thường chạy thử lưới thô để kiểm tra kịch bản, sau đó chạy lại lưới mịn để lấy kết quả chính thức.",
        "Bước 3: chia mesh sao cho số ô theo mỗi phương của mesh có dạng 2^a × 3^b × 5^c, vì bộ giải Poisson của FDS làm việc hiệu quả nhất với các số này. Đồng thời căn ranh mesh theo các kết cấu để tránh vật cản cắt ngang ô lưới.",
        "Cuối cùng, chạy ít nhất hai mức lưới và so sánh đại lượng bạn dùng để kết luận (tầm nhìn, nhiệt độ ở độ cao đầu người). Nếu hai kết quả gần nhau, lưới thô hơn đã đủ cho bài toán của bạn."
      ]
    },
    {
      id: "bv-rset", type: "article", title: "RSET gồm những gì và Pathfinder tính được phần nào",
      desc: "Phân biệt các thành phần thời gian thoát nạn để tránh nhầm khi viết thuyết minh.",
      tags: ["Thoát nạn", "Pathfinder"], read: "5 phút đọc",
      body: [
        "RSET là tổng thời gian cần thiết để toàn bộ người trong công trình đến được nơi an toàn. Nó gồm thời gian phát hiện cháy, thời gian báo động, thời gian nhận biết và phản ứng (còn gọi là thời gian trì hoãn trước khi di chuyển), và thời gian di chuyển.",
        "Pathfinder trực tiếp tính thời gian di chuyển từ hình học, số người và tốc độ đi. Các thành phần còn lại bạn phải đưa vào bằng giả định: thời gian phát hiện và báo động lấy từ hệ thống báo cháy thiết kế, thời gian trì hoãn đưa vào như độ trễ xuất phát của từng nhóm người.",
        "Pathfinder có hai chế độ di chuyển: SFPE (dòng người theo quan hệ tốc độ-mật độ, hạn chế va chạm) và Steering (tác nhân tự tránh nhau theo hành vi). Hãy nêu rõ chế độ bạn dùng và lý do chọn trong thuyết minh, vì kết quả hai chế độ có thể khác nhau ở khu vực đông người.",
        "Sau khi có RSET, so sánh với ASET lấy từ FDS. Điều kiện thiết kế là ASET lớn hơn RSET kèm một hệ số an toàn do tiêu chuẩn hoặc cơ quan thẩm duyệt quy định."
      ]
    },
    {
      id: "bv-revit", type: "article", title: "Từ Revit/CAD sang mô hình mô phỏng: quy trình năm bước",
      desc: "Làm gọn mô hình trước khi nhập vào PyroSim và Pathfinder để tránh lỗi hình học.",
      tags: ["Revit/BIM", "FDS", "Pathfinder"], read: "7 phút đọc",
      body: [
        "Mô hình kiến trúc đầy đủ thường quá chi tiết cho mô phỏng cháy. Mục tiêu là giữ lại những gì ảnh hưởng đến dòng khí và dòng người, bỏ phần còn lại.",
        "Bước 1: tạo bản sao riêng để làm sạch, không sửa mô hình gốc. Bước 2: chỉ giữ tường, sàn, trần, cửa, cầu thang, vách kính và các lỗ mở lớn; ẩn nội thất, chi tiết trang trí, hệ thống kỹ thuật nhỏ.",
        "Bước 3: kiểm tra đơn vị và gốc toạ độ, đưa công trình về gần gốc toạ độ để tránh sai số số học. Bước 4: xuất sang định dạng trao đổi mà phiên bản phần mềm của bạn hỗ trợ (ví dụ IFC hoặc DXF) rồi nhập vào PyroSim và Pathfinder; hãy kiểm tra danh sách định dạng trong tài liệu của đúng phiên bản bạn dùng.",
        "Bước 5: sau khi nhập, rà lại lỗ hổng ở tường, cửa không thông, sàn chồng lặp. Với FDS, dựng lại kết cấu theo lưới đã chọn thay vì dùng nguyên hình học cong; với Pathfinder, kiểm tra các cửa nối đúng hai phòng và cầu thang liên tục giữa các tầng."
      ]
    },
    {
      id: "bv-ketqua", type: "article", title: "Đọc kết quả để xác định ASET: tầm nhìn, nhiệt độ và độc tính",
      desc: "Chọn đại lượng và độ cao đo để kết luận, tránh trình bày kết quả đẹp nhưng không kết luận được.",
      tags: ["Khói & nhiệt", "FDS"], read: "6 phút đọc",
      body: [
        "ASET là thời điểm đầu tiên điều kiện tại một vị trí vượt ngưỡng chịu đựng. Bạn cần chọn trước đại lượng, ngưỡng và độ cao đo, rồi lấy thời điểm sớm nhất vượt ngưỡng trên toàn bộ đường thoát nạn.",
        "Các tiêu chí thường gặp là tầm nhìn (khoảng 10 m ở không gian lớn, khoảng 5 m ở không gian nhỏ), nhiệt độ khí ở độ cao đầu người (thường lấy khoảng 60 °C) và nồng độ khí độc như CO. Ngưỡng cụ thể phải lấy theo tiêu chuẩn bạn áp dụng hoặc thỏa thuận với cơ quan thẩm duyệt, đừng chỉ chép từ bài viết này.",
        "Đặt các thiết bị đo (slice, device) dọc đường thoát nạn ở độ cao khoảng 1,8–2,0 m, rồi xuất dữ liệu theo thời gian. Smokeview giúp quan sát, nhưng con số dùng trong thuyết minh nên lấy từ file dữ liệu của thiết bị đo.",
        "Cuối cùng, trình bày bảng ASET theo từng vị trí và từng tiêu chí, nêu tiêu chí nào quyết định. Đó là nội dung giúp hội đồng thấy bạn hiểu kết quả chứ không chỉ chạy được phần mềm."
      ]
    }
  ];

  var docTags = ["FDS", "Khói & nhiệt", "Thoát nạn", "Pathfinder", "Revit/BIM"];

  return { topics: topics, docs: docs, docTags: docTags, calcs: calcs };
})();
