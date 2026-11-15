/*
 * VỊ TRÍ ẢNH VÀ VIDEO. Mọi chỗ đặt hình trên trang được khai báo ở đây và để trống sẵn.
 * Để thêm tư liệu: đặt file vào web/public/media/ (hoặc dùng liên kết ngoài), điền `src` và `alt`
 * (ảnh) hoặc `title` (video/embed), rồi build lại. `src` trống = trang hiện khung giữ chỗ đúng tỉ lệ.
 * Quy cách chi tiết: xem web/MEDIA.md.
 */
import { topics } from "./topics.ts"
import { docs } from "./library.ts"
import { scenarios } from "./scenarios.ts"

export type MediaKind = "image" | "video" | "embed"

export interface MediaSlotDef {
  id: string
  kind: MediaKind
  /** Mục đích của vị trí, hiện trong khung giữ chỗ. */
  purpose: string
  /** Tỉ lệ khung, dạng "16/9". Khung luôn giữ tỉ lệ này nên không làm xô bố cục. */
  ratio: string
  /** Quy cách khuyến nghị, hiện trong khung giữ chỗ. */
  recommended: string
  /** Đường dẫn file (tương đối hoặc tuyệt đối) hoặc liên kết ngoài. Để trống = chưa có tư liệu. */
  src: string
  /** Ảnh bìa của video. */
  poster?: string
  /** Văn bản thay thế (ảnh) hoặc tiêu đề (video/embed), viết bằng tiếng Việt. Bắt buộc khi có src. */
  alt?: string
  /** Chú thích hiển thị dưới hình. */
  caption?: string
  /** Kích thước thật của ảnh (px) để trình duyệt giữ chỗ chính xác. */
  width?: number
  height?: number
}

const IMG_169 = "Ảnh WebP hoặc AVIF · tối thiểu 1280×720 · dưới 300 KB"
const IMG_43 = "Ảnh WebP hoặc AVIF · tối thiểu 1024×768 · dưới 250 KB"
const IMG_11 = "Ảnh WebP hoặc AVIF · tối thiểu 800×800 · dưới 200 KB"
const VIDEO_169 = "MP4 (H.264) hoặc liên kết YouTube/Drive · 1920×1080 · dưới 50 MB"

const fixed: MediaSlotDef[] = [
  { id: "logo", kind: "image", purpose: "Logo đơn vị (header, footer)", ratio: "4/1", recommended: "SVG hoặc PNG nền trong suốt · cao 64 px", src: "" },
  { id: "hero-video", kind: "embed", purpose: "Video mở đầu: chuyện gì diễn ra khi có cháy", ratio: "16/9", recommended: VIDEO_169, src: "" },
  { id: "concepts-aset-rset", kind: "image", purpose: "Hình gợi ý: sơ đồ so sánh ASET và RSET", ratio: "16/9", recommended: IMG_169, src: "" },
  { id: "concepts-video", kind: "embed", purpose: "Video đề xuất: công trình vận hành khi có cháy", ratio: "16/9", recommended: VIDEO_169, src: "" },
  { id: "concepts-smoke", kind: "image", purpose: "Khói tràn xuống dần từ trần", ratio: "4/3", recommended: `${IMG_43} (hoặc video MP4)`, src: "" },
  { id: "concepts-heatmap", kind: "image", purpose: "Bản đồ nhiệt của công trình", ratio: "4/3", recommended: `${IMG_43} (hoặc video MP4)`, src: "" },
  { id: "concepts-crowd", kind: "image", purpose: "Dòng người dồn về cửa thoát nạn", ratio: "4/3", recommended: `${IMG_43} (hoặc video MP4)`, src: "" },
  { id: "concepts-counter", kind: "image", purpose: "Đồng hồ đếm số người đã ra ngoài", ratio: "4/3", recommended: `${IMG_43} (hoặc video MP4)`, src: "" },
  { id: "software-pyrosim", kind: "image", purpose: "Ảnh màn hình PyroSim", ratio: "16/9", recommended: IMG_169, src: "" },
  { id: "software-pathfinder", kind: "image", purpose: "Ảnh màn hình Pathfinder", ratio: "16/9", recommended: IMG_169, src: "" },
  { id: "software-fds", kind: "image", purpose: "Ảnh kết quả FDS trong Smokeview", ratio: "16/9", recommended: IMG_169, src: "" },
  { id: "about-team", kind: "image", purpose: "Ảnh nhóm FireTech", ratio: "16/9", recommended: IMG_169, src: "" },
  { id: "instructor", kind: "image", purpose: "Ảnh người trao đổi cùng bạn", ratio: "1/1", recommended: IMG_11, src: "" },
  { id: "zalo-qr", kind: "image", purpose: "Mã QR nhóm Zalo thực chiến mô phỏng", ratio: "1/1", recommended: "Ảnh PNG mã QR · tối thiểu 512×512", src: "" },
]

const derived: MediaSlotDef[] = [
  ...scenarios.map((sc): MediaSlotDef => ({
    id: `scenario-${sc.id}`, kind: "image", purpose: `Ảnh hoặc video: ${sc.name}`, ratio: "16/9", recommended: `${IMG_169} (hoặc video MP4)`, src: "",
  })),
  ...topics.map((t): MediaSlotDef => ({
    id: `topic-${t.id}`, kind: "image", purpose: "Ảnh minh họa đề tài", ratio: "16/9", recommended: IMG_169, src: "",
  })),
  ...docs.filter((d) => d.type === "article").map((d): MediaSlotDef => ({
    id: `article-${d.id}`, kind: "image", purpose: "Ảnh bìa bài viết", ratio: "16/9", recommended: IMG_169, src: "",
  })),
]

export const mediaSlots: MediaSlotDef[] = [...fixed, ...derived]

const byId = new Map(mediaSlots.map((s) => [s.id, s]))

/** Trả về vị trí nếu đã có `src`, ngược lại null; chỗ gọi quyết định hiện hay ẩn (ví dụ logo). */
export function slotSrc(id: string): MediaSlotDef | null {
  const d = getSlot(id)
  return d.src.trim() ? d : null
}

export function getSlot(id: string): MediaSlotDef {
  const s = byId.get(id)
  if (!s) throw new Error(`Chưa khai báo vị trí media "${id}" trong data/media.ts`)
  return s
}
