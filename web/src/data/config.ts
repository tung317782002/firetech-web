/*
 * CẤU HÌNH: nơi duy nhất cần sửa để thay thông tin của đơn vị.
 *   - contact          : số điện thoại, email, Zalo tư vấn
 *   - zaloGroups       : các nhóm Zalo (thêm hoặc bớt phần tử, trang tự cập nhật)
 *   - plans            : gói học phí (giá VNĐ, số buổi, nội dung). Gói có featured: true được làm nổi bật
 *   - registerEndpoint : địa chỉ nhận form đăng ký. Để trống = form chuẩn bị nội dung để học viên gửi qua Zalo
 *                        hoặc email (không giả vờ đã gửi). Có giá trị = form gửi POST JSON
 *                        {name, phone, course, note, createdAt}.
 */
export interface Contact {
  phoneDisplay: string
  phoneTel: string
  email: string
  zalo: string
  address: string
}

export interface ZaloGroup {
  name: string
  desc: string
  url: string
}

export interface Plan {
  id: string
  name: string
  tagline: string
  badge?: string
  featured?: boolean
  price: number
  schedule: string
  features: string[]
}

export interface SiteConfig {
  brand: { name: string; domain: string }
  contact: Contact
  registerEndpoint: string
  zaloGroups: ZaloGroup[]
  plans: Plan[]
}

export const config: SiteConfig = {
  brand: { name: "FireTech", domain: "firetech.edu.vn" },

  contact: {
    phoneDisplay: "0387 582 114",
    phoneTel: "+84387582114",
    email: "firetech.ec@gmail.com",
    zalo: "https://zalo.me/0387582114",
    address: "",
  },

  registerEndpoint: "",

  zaloGroups: [
    {
      name: "Nhóm thực chiến mô phỏng",
      desc: "Trao đổi và gỡ lỗi PyroSim, FDS, Pathfinder; gửi file mô hình, ảnh lỗi, log chạy và chia sẻ kinh nghiệm làm đồ án.",
      url: "https://zalo.me/g/lvhvkq842",
    },
  ],

  plans: [
    {
      id: "pyrosim-pathfinder",
      name: "PyroSim + Pathfinder",
      tagline: "Mô phỏng cháy và thoát nạn từ bản vẽ CAD/Revit",
      badge: "Gói nền tảng",
      featured: true,
      price: 10000000,
      schedule: "10 buổi",
      features: [
        "Dựng mô hình PyroSim từ bản vẽ CAD/Revit",
        "Thiết lập kịch bản cháy, đường cong HRR, vật liệu",
        "Pathfinder: hồ sơ người, thời gian trì hoãn, chế độ SFPE và Steering",
        "Tính RSET và đối chiếu với ASET",
        "Mẫu thuyết minh phần mô phỏng",
        "Vào nhóm Zalo thực chiến mô phỏng",
      ],
    },
    {
      id: "fds-edit-video-bao-cao",
      name: "FDS + Edit video + Xuất báo cáo mô phỏng",
      tagline: "Chạy FDS, dựng video kết quả và hoàn thiện báo cáo",
      price: 5000000,
      schedule: "5 buổi",
      features: [
        "Chạy FDS: chia mesh, chọn lưới theo D*/dx",
        "Đọc và xuất kết quả bằng Smokeview",
        "Edit video kết quả mô phỏng để trình bày",
        "Xuất báo cáo mô phỏng hoàn chỉnh",
        "Vào nhóm Zalo thực chiến mô phỏng",
      ],
    },
  ],
}
