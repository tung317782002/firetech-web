/*
 * Năm tình huống mô phỏng, tóm tắt từ báo cáo dự án của đội ngũ FireTech.
 * Số liệu thuộc từng dự án cụ thể; chép đúng theo tài liệu nguồn, không tính lại hay làm tròn khác.
 * `pnpm kiem-so-lieu` kiểm các phép cộng RSET, yêu cầu 1,5 × RSET và hệ số ASET/RSET.
 */
export interface ScenarioTable {
  caption: string
  head: string[]
  rows: string[][]
  /** Nhận xét ngay dưới bảng. */
  note?: string
}

export interface Scenario {
  id: string
  /** Tên ngắn dùng ở danh sách và tiêu đề. */
  name: string
  /** Nội dung mô phỏng chính và kết luận chính trong bảng tổng quan. */
  overview: { content: string; conclusion: string }
  context: string
  simulation: string[]
  observations: string[]
  lessons: string[]
  /** Bài học bổ sung, viết thành một đoạn. */
  extra?: string
  basis: string[]
  table?: ScenarioTable
}

export const scenarios: Scenario[] = [
  {
    id: "ga-tau-dien-ngam",
    name: "Nhà ga tàu điện ngầm",
    overview: {
      content: "Ba kịch bản cháy tại tầng ke ga, tầng trung chuyển và đầu tàu dừng tại ke ga.",
      conclusion: "Thoát khói và thoát nạn cần tính song song; cả ba kịch bản đều đáp ứng hệ số an toàn 1,5.",
    },
    context:
      "Nhà ga là công trình ngầm có không gian khép kín và mật độ người cao. Phần lớn hành khách không quen thuộc lối đi; một số người có thể đang ngủ gật hoặc đi cùng trẻ nhỏ, nên thời gian phản ứng khi có báo động chênh lệch đáng kể giữa các nhóm.",
    simulation: [
      "Ba kịch bản cháy được xem xét: đám cháy tại hành lang khu văn phòng tầng ke ga, đám cháy thùng rác tại hành lang soát vé tầng trung chuyển và đám cháy ở đầu tàu khi tàu dừng tại ke ga.",
      "Với mỗi kịch bản, nhóm thực hiện xác định cả thời gian an toàn sẵn có (ASET) lẫn thời gian thoát nạn cần thiết (RSET) để so sánh trực tiếp.",
      "Luồng di chuyển của hành khách và của nhân viên nhà ga được mô phỏng riêng, phản ánh đúng vai trò của từng nhóm.",
    ],
    observations: [
      "Khói và nhiệt lan truyền lần lượt qua từng tầng của nhà ga.",
      "Với đám cháy trên tàu, nhiệt độ trong toa ở độ cao tầm người lên tới khoảng 225°C và tầm nhìn giảm dưới 5 m sau 10 phút; tuy vậy, cửa chắn ke ga đã giữ đám cháy bên trong tàu.",
      "Hành khách và nhân viên thoát ra theo những lối khác nhau, đúng với phương án tổ chức thoát nạn của công trình.",
    ],
    lessons: [
      "Đối với công trình ngầm, thoát khói và thoát nạn cần được tính toán song song, không thể tách rời.",
      "Người trực tiếp nhìn thấy đám cháy thường di chuyển ngay, trong khi người ở xa có thể mất vài phút mới bắt đầu thoát nạn; khoảng chênh lệch này cần được đưa vào giả định tính toán.",
      "Cả ba kịch bản đều cho ASET lớn hơn RSET, kể cả khi áp dụng hệ số an toàn 1,5.",
    ],
    extra:
      "Hệ thống cửa chắn ke ga (Platform Screen Doors) đóng kịp thời sau báo cháy có thể cô lập hoàn toàn đám cháy trên tàu, bảo vệ khu vực nhà ga.",
    basis: [
      "Đặc tính người: hành khách không thông thuộc công trình, cần được hướng dẫn qua loa, biển báo và nhân viên; nhân viên đã được đào tạo và tập huấn định kỳ. Thời gian chuẩn bị di tản tối đa lấy 330 giây (90 + 240 giây theo PD 7974-6, bảng C.1).",
      "Đám cháy thiết kế: khu hành lang, phòng chờ, văn phòng được tính là đám cháy phát triển trung bình; khu đầu tàu là đám cháy phát triển nhanh do chứa nhiều thiết bị, dây điện và vật liệu polyurethane (theo BRE 368). Thời gian mô phỏng 600 giây, giả định đám cháy duy trì liên tục ở công suất toả nhiệt lớn nhất.",
    ],
    table: {
      caption: "RSET và yêu cầu tối thiểu (1,5 × RSET) của ba kịch bản",
      head: ["Kịch bản", "RSET = phát hiện + báo động + chuẩn bị + di chuyển", "Yêu cầu tối thiểu (1,5 × RSET)", "Kết quả mô phỏng"],
      rows: [
        ["1. Hành lang văn phòng, tầng ke ga", "50 + 0 + 130 + 70 = 250 giây", "375 giây", "Vùng có người khoảng 35°C, tầm nhìn > 10 m: đạt"],
        ["2. Thùng rác, tầng trung chuyển", "50 + 0 + 90 + 160 = 300 giây", "450 giây", "Vùng có người khoảng 35°C, CO trong ngưỡng an toàn: đạt"],
        ["3. Đầu tàu dừng tại ke ga", "15 + 0 + 10 + 215 = 240 giây", "360 giây", "Cửa chắn ke ga cô lập đám cháy trong tàu: đạt"],
      ],
      note: "Ở cả ba kịch bản, ASET đạt trọn 600 giây mô phỏng, vượt mức yêu cầu 1,5 × RSET. Báo cáo kết luận phương án kiểm soát khói và hệ thống lối thoát nạn đủ duy trì điều kiện an toàn cho người trong nhà ga.",
    },
  },
  {
    id: "kho-ke-cao",
    name: "Nhà kho kệ cao (hai phương án mô phỏng trên cùng một công trình)",
    overview: {
      content: "Đám cháy chặn cửa giữa hai khu; so sánh cháy tại kho mát (có sprinkler) và kho lạnh (không có sprinkler).",
      conclusion: "Đầu báo khói nhạy đóng vai trò then chốt; nếu không có hút khói, kho bị khói bao trùm sau khoảng 7–9 phút.",
    },
    context:
      "Công trình là kho kín nhiệt với nhiều dãy kệ cao, gồm khu kho mát và khu kho lạnh nằm liền kề. Công nhân làm việc trong trang phục bảo hộ chống lạnh dày nên di chuyển kém linh hoạt hơn so với điều kiện thông thường.",
    simulation: [
      "Đám cháy giả định được đặt ngay tại cửa thông giữa hai khu, chặn lối đi chính. Đây là kịch bản bất lợi nhất: công nhân buộc phải quay lại tìm cửa thoát khẩn cấp ra sân, vừa vòng qua các dãy kệ, vừa bị cản trở bởi trang phục bảo hộ cồng kềnh.",
      "Trên cùng một công trình, hai kịch bản được đặt cạnh nhau để so sánh: đám cháy tại cửa xuất nhập hàng của kho mát (có hệ thống sprinkler) và đám cháy bên trong kho lạnh (không có sprinkler).",
    ],
    observations: [
      "Đám cháy phát triển rất nhanh do lượng lớn pallet và thùng nhựa trong kho.",
      "Khói tích tụ thành lớp dưới trần, sau đó hạ dần xuống ngang tầm mắt; chỉ sau vài phút, lớp khói đã lan từ khu này sang khu kia.",
      "Khoảng 3 phút sau khi cháy, điều kiện trong kho bắt đầu vượt ngưỡng nguy hiểm. Trong khi đó, công nhân nhận được tín hiệu và bắt đầu thoát nạn chỉ sau khoảng 1 phút.",
    ],
    lessons: [
      "Đầu báo khói có độ nhạy cao giúp rút ngắn đáng kể thời gian xác nhận cháy.",
      "Với kho kín không trang bị hệ thống hút khói, toàn bộ công trình có thể bị khói bao trùm sau khoảng 7–9 phút.",
      "Nhờ được cảnh báo sớm, người trong kho thoát ra hết trước thời điểm khói trở nên nguy hiểm một khoảng khá xa.",
    ],
    extra:
      "Khi không có hệ thống hút khói, việc khống chế chiều cao chất xếp hàng dưới 2 m tạo ra một bể chứa khói lớn sát trần, làm chậm thời điểm lớp khói hạ xuống độ cao an toàn; kết hợp với cửa thoát nạn mở thẳng ra sân bãi, công trình vẫn bảo đảm an toàn thoát nạn.",
    basis: [
      "Quy mô và điều kiện: kho hai tầng, 45 người trong ca cao điểm; kho lạnh 0–5°C với trần cao 3,5 m, kho mát 10–15°C với trần cao 4,0 m; hàng hoá chất xếp cao dưới 2 m; công trình không trang bị hệ thống hút khói.",
      "Chất cháy và đám cháy thiết kế: pallet nhựa ABS, thùng nhựa HDPE, màng co PE. Đám cháy phát triển nhanh theo hàm bậc hai (Q = 0,0469·t²), đạt đỉnh khoảng 1.400 kW sau khoảng 173 giây, khi sprinkler ESFR kích hoạt.",
      "Đặc tính người: tiếng ồn dàn lạnh và mũ trùm làm giảm khả năng nghe chuông báo; làm việc lâu trong môi trường lạnh khiến phản xạ chậm hơn; công nhân thường kiểm tra đồng nghiệp còn kẹt trong buồng lạnh trước khi rời đi.",
      "Thông số thoát nạn: tốc độ đi bộ trung bình 1,2 m/s; qua cửa trượt kho lạnh giảm còn 0,5–0,6 m/s; thời gian phản ứng từ 16–18 giây (người ngay tại chỗ cháy) đến 70–72 giây (khối văn phòng tầng 2).",
      "Phát hiện cháy: đầu báo khói kiểu hút (VESDA) kích hoạt sau khoảng 15 giây.",
    ],
    table: {
      caption: "RSET, ASET và hệ số ASET/RSET của hai kịch bản",
      head: ["Kịch bản", "RSET = phát hiện + báo động + chuẩn bị + di chuyển", "ASET", "Hệ số ASET/RSET"],
      rows: [
        ["1. Cháy tại cửa xuất nhập hàng (kho mát)", "10 + 5 + 43 + 25 = 83 giây", "200 giây", "khoảng 2,4"],
        ["2. Cháy bên trong kho lạnh", "20 + 5 + 33 + 12 = 70 giây", "150 giây", "khoảng 2,1"],
      ],
      note: "Cả hai kịch bản đều đạt hệ số an toàn trên 2, cao hơn nhiều so với mức yêu cầu 1,5. Toàn bộ nhân sự thoát ra ngoài qua các cửa thoát hiểm khẩn cấp trước khi bất kỳ yếu tố nguy hiểm nào vượt ngưỡng.",
    },
  },
  {
    id: "kho-ba-tang",
    name: "Nhà kho ba tầng",
    overview: {
      content: "Lan truyền khói và bức xạ nhiệt; so sánh phát hiện cháy sớm và muộn.",
      conclusion: "Phát hiện cháy sớm và buồng thang không nhiễm khói là hai yếu tố quyết định.",
    },
    context: "Công trình là nhà kho nhiều tầng, trong đó có một tầng bố trí văn phòng. Việc thoát nạn chủ yếu dựa vào hệ thống cầu thang bộ.",
    simulation: [
      "Mô hình số được đối chiếu với bản vẽ thiết kế trước khi tiến hành tính toán.",
      "Quá trình lan truyền khói, truyền nhiệt và bức xạ nhiệt trong công trình được theo dõi theo thời gian.",
      "Quá trình thoát nạn được xem xét với ba nhóm người: người phát hiện đám cháy, người làm việc tại khu văn phòng và người thoát ra sau cùng.",
      "Hai phương án phát hiện cháy được so sánh: phát hiện sớm (khoảng 50 giây) và phát hiện muộn hơn (khoảng 80–120 giây).",
    ],
    observations: [
      "Buồng thang bộ không bị khói xâm nhập trong suốt khoảng 10 phút mô phỏng, nhờ đó người trong công trình vẫn di chuyển xuống an toàn.",
      "Tại khu vực cháy, tầm nhìn giảm xuống mức đặc biệt nguy hiểm sau khoảng 5 phút.",
      "Người ở xa vị trí cháy nhận biết muộn hơn, vì vậy bắt đầu thoát nạn muộn hơn so với người ở gần.",
    ],
    lessons: [
      "Tốc độ di chuyển trên cầu thang thấp hơn đáng kể so với trên mặt bằng, cần được tính riêng trong bài toán thoát nạn.",
      "Thời điểm phát hiện cháy sớm hay muộn ảnh hưởng rõ rệt đến kết quả thoát nạn.",
      "Với công trình nhiều tầng, việc giữ buồng thang không nhiễm khói là điều kiện tiên quyết bảo đảm an toàn cho người sử dụng.",
    ],
    basis: [
      "Đánh giá theo cùng phương pháp so sánh ASET và RSET, với các tiêu chí an toàn đo tại độ cao 2 m: nhiệt độ ≤ 60°C, nhiệt bức xạ ≤ 2,5 kW/m², tầm nhìn ≥ 10 m.",
      "Tốc độ trên cầu thang được thiết lập riêng: theo sổ tay SFPE, người không khuyết tật đi xuống cầu thang trung bình khoảng 0,7 m/s, thấp hơn rõ rệt so với khoảng 1,25 m/s trên mặt bằng.",
      "Thời gian phát hiện cháy được lấy trực tiếp từ mô hình FDS, nên việc so sánh phát hiện sớm và muộn phản ánh đúng ảnh hưởng của hệ thống báo cháy tới RSET.",
    ],
  },
  {
    id: "nha-xuong-cong-nghiep",
    name: "Nhà xưởng công nghiệp",
    overview: {
      content: "Phát triển đám cháy, khói, nhiệt và quá trình sơ tán người lao động.",
      conclusion: "Tầm nhìn và chiều cao lớp khói là yếu tố cần ưu tiên đánh giá trước tiên.",
    },
    context: "Nhà xưởng có không gian rộng, trần cao và nhiều dãy giá hàng, đặc trưng của công trình sản xuất quy mô lớn.",
    simulation: [
      "Quá trình phát triển của đám cháy, sự lan truyền khói và phân bố nhiệt độ trong toàn bộ không gian xưởng.",
      "Quá trình người lao động nhận biết đám cháy và di chuyển ra ngoài, kèm bộ đếm số người đã thoát theo thời gian.",
    ],
    observations: [
      "Các mặt cắt nhiệt độ thể hiện trực quan cách khói và nhiệt bốc lên, tích tụ rồi lan rộng trong không gian lớn.",
      "Số người thoát ra tăng dần theo thời gian cho đến khi nhà xưởng được sơ tán hoàn toàn.",
    ],
    lessons: [
      "Ở những không gian lớn, tầm nhìn và chiều cao lớp khói là các yếu tố đầu tiên quyết định khả năng thoát nạn an toàn, cần được ưu tiên đánh giá ngay từ giai đoạn thiết kế.",
    ],
    basis: [
      "Theo các tiêu chí của Fire Engineering Design Guide, ngưỡng tầm nhìn 10 m (tương đương mật độ khói quang học 0,1/m) được áp dụng cho không gian lớn; với phòng nhỏ, mật độ khói cho phép có thể lớn gấp đôi.",
      "Ở nhà xưởng trần cao, khói bốc lên tạo dòng trần, tích tụ trong “bể chứa khói” sát mái rồi mới hạ dần xuống. Dung tích phần không gian phía trên vì thế quyết định khoảng thời gian an toàn trước khi lớp khói chạm độ cao 2 m.",
    ],
  },
  {
    id: "vien-duong-lao",
    name: "Viện dưỡng lão nhiều tầng",
    overview: {
      content: "Diễn biến tầm nhìn; thoát nạn từng tầng và người ngồi xe lăn.",
      conclusion: "Cần thông số riêng cho người cao tuổi; một người cần hỗ trợ có thể kéo dài thời gian thoát nạn của cả nhóm.",
    },
    context:
      "Người sử dụng công trình chủ yếu là người cao tuổi, di chuyển chậm; một số người ngồi xe lăn và cần hộ lý hỗ trợ. Công trình gồm sảnh, hành lang và cầu thang bộ trên nhiều tầng.",
    simulation: [
      "Nhiệt lượng toả ra từ đám cháy trong giai đoạn đầu.",
      "Diễn biến của tầm nhìn theo thời gian.",
      "Quá trình thoát nạn của từng tầng, của gian phòng bất lợi nhất và của người ngồi xe lăn.",
      "Hai phương án được mô phỏng để so sánh hiệu quả.",
    ],
    observations: [
      "Trong những phút đầu, đám cháy toả nhiệt không lớn mà chủ yếu sinh khói.",
      "Tầm nhìn vẫn bảo đảm an toàn trong khoảng 5 phút đầu, sau đó suy giảm xuống mức nguy hiểm vào khoảng phút thứ 6–7.",
      "Toàn bộ người ở tầng 2 thoát ra sau khoảng 2–3 phút, tuỳ theo phương án.",
    ],
    lessons: [
      "Đối với người cao tuổi và người hạn chế khả năng vận động, thời gian chuẩn bị và tốc độ di chuyển cần được thiết lập riêng, không thể dùng thông số của người bình thường.",
      "Khi có người cần hỗ trợ, nhân viên phải tách ra để giúp đỡ, khiến thời gian thoát nạn của cả nhóm kéo dài thêm.",
      "Gian phòng bất lợi nhất luôn cần được xem xét kỹ lưỡng nhất trong toàn bộ công trình.",
    ],
    basis: [
      "Tốc độ di chuyển của người hạn chế vận động được lấy theo sổ tay SFPE: người ngồi xe lăn trung bình khoảng 0,57 m/s trên mặt bằng và 0,16 m/s khi xuống cầu thang, so với khoảng 1,25 m/s và 0,70 m/s ở người không khuyết tật.",
      "Nguyên tắc chọn kịch bản: không mô phỏng mọi đám cháy có thể xảy ra, mà chọn kịch bản vừa đáng tin cậy vừa bất lợi nhất, tức là kịch bản làm RSET dài nhất và/hoặc ASET ngắn nhất. Vì vậy gian phòng bất lợi nhất luôn được xem xét riêng.",
    ],
  },
]
