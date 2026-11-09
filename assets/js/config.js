/*
 * CẤU HÌNH TRANG WEB — nơi duy nhất cần sửa để thay thông tin của đơn vị.
 *
 * Tất cả giá trị dưới đây là GIÁ TRỊ MẪU. Hãy thay bằng thông tin thật trước khi công bố:
 *   - contact.phoneDisplay / contact.phoneTel : số điện thoại hiển thị và số dùng cho liên kết gọi
 *   - contact.email, contact.zalo             : email và liên kết Zalo cá nhân/OA
 *   - zaloGroups[].url                        : liên kết mời vào từng nhóm Zalo
 *   - plans[]                                 : tên gói, giá (VNĐ), lịch học, quyền lợi
 *   - registerEndpoint                        : địa chỉ nhận form đăng ký (để trống = hiện nội dung để gửi qua Zalo/email)
 */
window.FIRETECH_CONFIG = {
  brand: {
    name: "FireTech",
    domain: "firetech.edu.vn"
  },

  contact: {
    phoneDisplay: "0900 000 000",
    phoneTel: "+84900000000",
    email: "lienhe@firetech.edu.vn",
    zalo: "https://zalo.me/0900000000",
    address: "Hà Nội · Học trực tuyến toàn quốc"
  },

  // Để trống nếu chưa có. Nếu có, form sẽ gửi POST JSON {name, phone, course, note, createdAt} tới địa chỉ này
  // (ví dụ Google Apps Script, Formspree, API của bạn).
  registerEndpoint: "",

  zaloGroups: [
    {
      name: "Gỡ lỗi PyroSim & FDS",
      desc: "Gửi file .fds, ảnh lỗi từ log; hỏi về lưới, HRR, vật liệu, điều kiện biên.",
      url: "https://zalo.me/g/thay-ma-nhom-1"
    },
    {
      name: "Gỡ lỗi Pathfinder",
      desc: "Lỗi nhập hình học từ CAD/Revit, cấu hình hồ sơ người, cửa, thang, SFPE và Steering.",
      url: "https://zalo.me/g/thay-ma-nhom-2"
    },
    {
      name: "Đồ án PCCC & Kiến trúc",
      desc: "Trao đổi chọn đề tài, bố cục thuyết minh, tiêu chuẩn QCVN 06 / NFPA, phản biện chéo.",
      url: "https://zalo.me/g/thay-ma-nhom-3"
    }
  ],

  // Giá tính bằng VNĐ. Gói combo tự động hiển thị mức tiết kiệm so với tổng giá hai gói lẻ.
  plans: [
    {
      id: "pyrosim-fds",
      name: "PyroSim + FDS",
      tagline: "Mô phỏng cháy, khói và nhiệt",
      price: 2990000,
      schedule: "12 buổi · 3 giờ/buổi",
      features: [
        "Dựng mô hình từ bản vẽ CAD/Revit",
        "Thiết lập đám cháy, đường cong HRR, vật liệu",
        "Chọn lưới theo D*/dx và chia mesh",
        "Đọc kết quả bằng Smokeview và xuất dữ liệu",
        "Mẫu thuyết minh phần mô phỏng cháy",
        "Vào nhóm Zalo gỡ lỗi"
      ]
    },
    {
      id: "pathfinder",
      name: "Pathfinder",
      tagline: "Mô phỏng thoát nạn và tính RSET",
      price: 1990000,
      schedule: "8 buổi · 3 giờ/buổi",
      features: [
        "Nhập hình học từ CAD/Revit",
        "Hồ sơ người, tốc độ đi, thời gian trì hoãn",
        "Chế độ SFPE và Steering",
        "Tính RSET và đọc biểu đồ dòng người",
        "Mẫu thuyết minh phần thoát nạn",
        "Vào nhóm Zalo gỡ lỗi"
      ]
    },
    {
      id: "combo",
      name: "Combo đồ án trọn gói",
      tagline: "PyroSim + FDS và Pathfinder, đối chiếu ASET/RSET",
      badge: "Phù hợp làm đồ án tốt nghiệp",
      price: 4290000,
      schedule: "20 buổi · 3 giờ/buổi",
      features: [
        "Toàn bộ nội dung hai gói lẻ",
        "Quy trình Revit → PyroSim → Pathfinder",
        "Đối chiếu ASET với RSET và hệ số an toàn",
        "Góp ý bố cục đồ án, luận văn",
        "Ưu tiên hỗ trợ trong nhóm Zalo"
      ]
    }
  ]
};
