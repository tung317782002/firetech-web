/*
 * VỊ TRÍ ẢNH VÀ VIDEO. Mọi chỗ đặt hình trên trang được khai báo ở đây và để trống sẵn.
 * Để thêm tư liệu: đặt file vào web/public/media/ (hoặc dùng liên kết ngoài), điền `src` và `alt`
 * (ảnh) hoặc `title` (video/embed), rồi build lại. `src` trống = trang hiện khung giữ chỗ đúng tỉ lệ.
 * Quy cách chi tiết: xem web/MEDIA.md.
 */
import { topics } from "./topics.ts"
import { docs } from "./library.ts"

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
  { id: "hero-video", kind: "embed", purpose: "Video giới thiệu khóa học", ratio: "16/9", recommended: VIDEO_169, src: "" },
  { id: "software-pyrosim", kind: "image", purpose: "Ảnh màn hình PyroSim", ratio: "16/9", recommended: IMG_169, src: "" },
  { id: "software-pathfinder", kind: "image", purpose: "Ảnh màn hình Pathfinder", ratio: "16/9", recommended: IMG_169, src: "" },
  { id: "software-fds", kind: "image", purpose: "Ảnh kết quả FDS trong Smokeview", ratio: "16/9", recommended: IMG_169, src: "" },
  ...Array.from({ length: 6 }, (_, i): MediaSlotDef => ({
    id: `result-${i + 1}`, kind: "image", purpose: `Kết quả mô phỏng của học viên ${i + 1}`, ratio: "4/3", recommended: `${IMG_43} (hoặc video MP4)`, src: "",
  })),
  { id: "course-pyrosim-pathfinder", kind: "image", purpose: "Ảnh hoặc video giới thiệu gói PyroSim + Pathfinder", ratio: "16/9", recommended: IMG_169, src: "" },
  { id: "course-fds-edit-video-bao-cao", kind: "image", purpose: "Ảnh hoặc video giới thiệu gói FDS + Edit video + Xuất báo cáo", ratio: "16/9", recommended: IMG_169, src: "" },
  { id: "instructor", kind: "image", purpose: "Ảnh giảng viên", ratio: "1/1", recommended: IMG_11, src: "" },
  { id: "zalo-qr", kind: "image", purpose: "Mã QR nhóm Zalo thực chiến mô phỏng", ratio: "1/1", recommended: "Ảnh PNG mã QR · tối thiểu 512×512", src: "" },
]

const derived: MediaSlotDef[] = [
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
