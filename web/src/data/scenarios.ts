/*
 * Năm tình huống mô phỏng, tóm tắt ở mức khái quát từ báo cáo dự án của đội ngũ FireTech E&C.
 * Chữ lấy theo bản demo đã duyệt: không nêu số liệu chi tiết của từng dự án (bảng RSET/ASET, cơ sở tính toán).
 * Phần số liệu chi tiết trước đây nằm trong lịch sử git (PR #2) nếu cần khôi phục.
 */
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
}

export const scenarios: Scenario[] = [
  {
    id: "ga-tau-dien-ngam",
    name: "Nhà ga tàu điện ngầm",
    overview: {
      content: "Ba kịch bản cháy tại tầng ke ga, tầng trung chuyển và đầu tàu dừng tại ke ga.",
      conclusion: "Thoát khói và thoát nạn cần được tính song song; cả ba kịch bản đều bảo đảm an toàn với hệ số dự phòng.",
    },
    context:
      "Nhà ga là công trình ngầm có không gian khép kín và mật độ người cao. Phần lớn hành khách không thông thuộc lối đi, nên thời gian phản ứng khi có báo động chênh lệch đáng kể giữa các nhóm người.",
    simulation: [
      "Ba vị trí cháy được xem xét: khu văn phòng tại tầng ke ga, khu soát vé tại tầng trung chuyển và đầu tàu khi tàu đang dừng tại ke ga.",
      "Với mỗi kịch bản, nhóm thực hiện xác định đồng thời thời gian an toàn sẵn có (ASET) và thời gian thoát nạn cần thiết (RSET) để so sánh trực tiếp.",
      "Luồng di chuyển của hành khách và của nhân viên nhà ga được mô phỏng riêng, phản ánh đúng vai trò của từng nhóm.",
    ],
    observations: [
      "Khói và nhiệt lan truyền lần lượt qua từng tầng của nhà ga theo các lối thông tầng.",
      "Với đám cháy trên tàu, điều kiện bên trong toa suy giảm nhanh, song cửa chắn ke ga đã giữ đám cháy và khói trong phạm vi đoàn tàu.",
      "Hành khách và nhân viên thoát ra theo những lối khác nhau, đúng với phương án tổ chức thoát nạn của công trình.",
    ],
    lessons: [
      "Đối với công trình ngầm, thoát khói và thoát nạn cần được tính toán song song, không thể tách rời.",
      "Người trực tiếp nhìn thấy đám cháy thường di chuyển ngay, trong khi người ở xa có thể mất vài phút mới bắt đầu thoát nạn; khoảng chênh lệch này cần được đưa vào giả định tính toán.",
      "Cả ba kịch bản đều cho ASET lớn hơn RSET, kể cả khi đã áp dụng hệ số an toàn.",
    ],
    extra:
      "Hệ thống cửa chắn ke ga (Platform Screen Doors) đóng kịp thời sau báo cháy có thể cô lập đám cháy trên tàu, bảo vệ khu vực nhà ga.",
  },
  {
    id: "kho-ke-cao",
    name: "Nhà kho kệ cao",
    overview: {
      content: "Đám cháy chặn cửa giữa hai khu; so sánh cháy tại kho mát (có sprinkler) và kho lạnh (không có sprinkler).",
      conclusion: "Đầu báo khói nhạy đóng vai trò then chốt; nếu không có hút khói, kho có thể bị khói bao trùm chỉ sau vài phút.",
    },
    context:
      "Công trình là kho kín nhiệt với nhiều dãy kệ cao, gồm khu kho mát và khu kho lạnh nằm liền kề. Người lao động mặc trang phục bảo hộ chống lạnh nên di chuyển kém linh hoạt hơn so với điều kiện thông thường.",
    simulation: [
      "Đám cháy giả định được đặt ngay tại cửa thông giữa hai khu, chặn lối đi chính. Đây là kịch bản bất lợi nhất: người lao động buộc phải quay lại tìm cửa thoát khẩn cấp, vừa vòng qua các dãy kệ, vừa bị cản trở bởi trang phục bảo hộ.",
      "Trên cùng một công trình, hai kịch bản được đặt cạnh nhau để so sánh: đám cháy tại cửa xuất nhập hàng của kho mát (có hệ thống sprinkler) và đám cháy bên trong kho lạnh (không có sprinkler).",
    ],
    observations: [
      "Đám cháy phát triển rất nhanh do lượng lớn pallet và thùng nhựa trong kho.",
      "Khói tích tụ thành lớp dưới trần, sau đó hạ dần xuống ngang tầm mắt và lan từ khu này sang khu kia.",
      "Người trong kho nhận được tín hiệu báo cháy và bắt đầu thoát nạn từ rất sớm, trước khi điều kiện trong kho vượt ngưỡng nguy hiểm.",
    ],
    lessons: [
      "Đầu báo khói có độ nhạy cao giúp rút ngắn đáng kể thời gian xác nhận cháy.",
      "Với kho kín không trang bị hệ thống hút khói, toàn bộ công trình có thể bị khói bao trùm chỉ sau vài phút.",
      "Nhờ được cảnh báo sớm, người trong kho thoát ra hết trước thời điểm khói trở nên nguy hiểm một khoảng khá xa.",
    ],
    extra:
      "Khi không có hệ thống hút khói, việc giới hạn chiều cao chất xếp hàng tạo ra một bể chứa khói lớn sát trần, làm chậm thời điểm lớp khói hạ xuống độ cao nguy hiểm; kết hợp với cửa thoát nạn mở thẳng ra sân bãi, công trình vẫn bảo đảm an toàn thoát nạn.",
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
      "Hai phương án phát hiện cháy được so sánh: phát hiện sớm và phát hiện muộn hơn.",
    ],
    observations: [
      "Buồng thang bộ không bị khói xâm nhập trong suốt thời gian mô phỏng, nhờ đó người trong công trình vẫn di chuyển xuống an toàn.",
      "Tại khu vực cháy, tầm nhìn suy giảm xuống mức nguy hiểm sau vài phút.",
      "Người ở xa vị trí cháy nhận biết muộn hơn, vì vậy bắt đầu thoát nạn muộn hơn so với người ở gần.",
    ],
    lessons: [
      "Tốc độ di chuyển trên cầu thang thấp hơn đáng kể so với trên mặt bằng, cần được tính riêng trong bài toán thoát nạn.",
      "Thời điểm phát hiện cháy sớm hay muộn ảnh hưởng rõ rệt đến kết quả thoát nạn.",
      "Với công trình nhiều tầng, việc giữ buồng thang không nhiễm khói là điều kiện tiên quyết bảo đảm an toàn cho người sử dụng.",
    ],
  },
  {
    id: "nha-xuong-cong-nghiep",
    name: "Nhà xưởng công nghiệp",
    overview: {
      content: "Phát triển đám cháy, khói, nhiệt và quá trình sơ tán người lao động.",
      conclusion: "Tầm nhìn và chiều cao lớp khói là những yếu tố cần ưu tiên đánh giá trước tiên.",
    },
    context: "Nhà xưởng có không gian rộng, trần cao và nhiều dãy giá hàng, đặc trưng của công trình sản xuất quy mô lớn.",
    simulation: [
      "Quá trình phát triển của đám cháy, sự lan truyền khói và phân bố nhiệt độ trong toàn bộ không gian xưởng.",
      "Quá trình người lao động nhận biết đám cháy và di chuyển ra ngoài, kèm bộ đếm số người đã thoát theo thời gian.",
    ],
    observations: [
      "Các mặt cắt nhiệt độ thể hiện trực quan cách khói và nhiệt bốc lên, tích tụ sát mái rồi lan rộng trong không gian lớn.",
      "Số người thoát ra tăng dần theo thời gian cho đến khi nhà xưởng được sơ tán hoàn toàn.",
    ],
    lessons: [
      "Ở những không gian lớn, tầm nhìn và chiều cao lớp khói là các yếu tố đầu tiên quyết định khả năng thoát nạn an toàn, cần được ưu tiên đánh giá ngay từ giai đoạn thiết kế.",
      "Phần không gian phía trên mái đóng vai trò như một bể chứa khói; dung tích của nó quyết định khoảng thời gian an toàn trước khi lớp khói hạ xuống vùng có người.",
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
      "Tầm nhìn vẫn bảo đảm an toàn trong vài phút đầu, sau đó suy giảm dần xuống mức nguy hiểm.",
      "Người ở các tầng trên thoát ra hết trong vài phút, nhanh hay chậm tuỳ theo phương án.",
    ],
    lessons: [
      "Đối với người cao tuổi và người hạn chế khả năng vận động, thời gian chuẩn bị và tốc độ di chuyển cần được thiết lập riêng, không thể dùng thông số của người bình thường.",
      "Khi có người cần hỗ trợ, nhân viên phải tách ra để giúp đỡ, khiến thời gian thoát nạn của cả nhóm kéo dài thêm.",
      "Gian phòng bất lợi nhất luôn cần được xem xét kỹ lưỡng nhất trong toàn bộ công trình.",
    ],
  },
]
