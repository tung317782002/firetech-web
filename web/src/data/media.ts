/*
 * VỊ TRÍ ẢNH VÀ VIDEO. Mọi chỗ đặt hình trên trang được khai báo ở đây và để trống sẵn.
 * Để thêm tư liệu: đặt file vào web/public/media/ (hoặc dùng liên kết ngoài), điền `src` và `alt`
 * (ảnh) hoặc `title` (video/embed), rồi build lại. `src` trống = trang hiện khung giữ chỗ đúng tỉ lệ.
 * Quy cách chi tiết: xem web/MEDIA.md.
 */
import { topics } from "./topics.ts"
import { docs } from "./library.ts"
import { scenarios } from "./scenarios.ts"
import { LOGO } from "./logo.ts"

/** `youtube`: ảnh bìa + nút phát, bấm mở video YouTube ở tab mới (`href`); `embed`: khung nhúng. */
export type MediaKind = "image" | "video" | "embed" | "youtube"

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
  /** Liên kết đích của loại `youtube`. */
  href?: string
  /** Nhãn ngắn (chữ in hoa) dưới khung, ví dụ "Mô hình mô phỏng". */
  label?: string
  /** Kích thước thật của ảnh (px) để trình duyệt giữ chỗ chính xác. */
  width?: number
  height?: number
}

const IMG_169 = "Ảnh WebP hoặc AVIF · tối thiểu 1280×720 · dưới 300 KB"
const IMG_43 = "Ảnh WebP hoặc AVIF · tối thiểu 1024×768 · dưới 250 KB"
const IMG_11 = "Ảnh WebP hoặc AVIF · tối thiểu 800×800 · dưới 200 KB"
const VIDEO_169 = "MP4 (H.264) hoặc liên kết YouTube/Drive · 1920×1080 · dưới 50 MB"

const VIDEO_MP4 = "MP4 (H.264) · dưới 4 MB · kèm ảnh bìa JPG"
const POSTER_CC = "media/mo-phong/chung-cu-poster.jpg"
const POSTER = (id: string) => `media/tinh-huong/${id}-poster.jpg`

const fixed: MediaSlotDef[] = [
  { id: "logo", kind: "image", purpose: "Logo đơn vị (header, footer)", ratio: `${LOGO.width}/${LOGO.height}`, recommended: "SVG hoặc PNG nền trong suốt · cao 64 px", src: LOGO.src, alt: "Logo FireTech E&C", width: LOGO.width, height: LOGO.height },
  {
    id: "hero-video", kind: "youtube", purpose: "Video mở đầu: diễn biến cháy và thoát nạn nhà cao tầng", ratio: "16/9", recommended: VIDEO_169,
    src: POSTER_CC, href: "https://www.youtube.com/watch?v=-AC8onWOCuQ",
    alt: "Mô phỏng diễn biến cháy và thoát nạn nhà cao tầng bằng FDS, PyroSim và Pathfinder (mở trên YouTube)",
  },
  {
    id: "concepts-aset-rset", kind: "image", purpose: "Sơ đồ so sánh ASET và RSET", ratio: "16/9", recommended: IMG_169,
    src: "media/so-do-aset-rset.svg", width: 1280, height: 720,
    alt: "Sơ đồ so sánh ASET và RSET: RSET gồm thời gian phát hiện, báo động, chuẩn bị và di chuyển; ASET phải dài hơn RSET một biên an toàn",
  },
  {
    id: "concepts-video", kind: "video", purpose: "Video mô phỏng một tòa chung cư cao tầng", ratio: "16/9", recommended: VIDEO_MP4,
    src: "media/mo-phong/chung-cu.mp4", poster: POSTER_CC,
    alt: "Mô phỏng cháy và thoát nạn một tòa chung cư cao tầng: diễn biến đám cháy, nhiệt độ, tầm nhìn hành lang, khói và dòng người thoát nạn",
  },
  {
    id: "concepts-smoke", kind: "image", purpose: "Khói", ratio: "4/3", recommended: IMG_43,
    src: "media/mo-phong/khoi.webp", width: 1024, height: 768, alt: "Cột khói đen bốc lên từ đám cháy tại khu sinh hoạt chung của tòa chung cư",
  },
  {
    id: "concepts-visibility", kind: "image", purpose: "Tầm nhìn", ratio: "4/3", recommended: IMG_43,
    src: "media/mo-phong/tam-nhin.webp", width: 1024, height: 768, alt: "Mặt cắt tầm nhìn tại hành lang chung cư, vùng màu đỏ là nơi tầm nhìn bị khói làm suy giảm",
  },
  {
    id: "concepts-crowd", kind: "image", purpose: "Dòng người", ratio: "4/3", recommended: IMG_43,
    src: "media/mo-phong/dong-nguoi.webp", width: 1024, height: 768, alt: "Cư dân chung cư dồn xuống cầu thang bộ thoát nạn trong mô phỏng Pathfinder",
  },
  {
    id: "concepts-density", kind: "image", purpose: "Mật độ người", ratio: "4/3", recommended: IMG_43,
    src: "media/mo-phong/mat-do-nguoi.webp", width: 1024, height: 768, alt: "Bản đồ mật độ người trên mặt bằng một tầng chung cư trong quá trình thoát nạn",
  },
  {
    id: "software-pyrosim", kind: "image", purpose: "Ảnh màn hình PyroSim", ratio: "16/9", recommended: IMG_169,
    src: "media/phan-mem/pyrosim.webp", width: 1280, height: 720, alt: "Logo phần mềm PyroSim",
  },
  {
    id: "software-pathfinder", kind: "image", purpose: "Ảnh màn hình Pathfinder", ratio: "16/9", recommended: IMG_169,
    src: "media/phan-mem/pathfinder.webp", width: 1280, height: 720, alt: "Logo phần mềm Pathfinder",
  },
  {
    id: "software-fds", kind: "image", purpose: "Ảnh kết quả FDS trong Smokeview", ratio: "16/9", recommended: IMG_169,
    src: "media/phan-mem/fds.webp", width: 1280, height: 720, alt: "Logo FDS và Smokeview: luồng khói bốc lên từ đám cháy",
  },
  {
    id: "contact-site", kind: "image", purpose: "Ảnh hiện trường", ratio: "1/1", recommended: IMG_11,
    src: "media/lien-he-hien-truong.webp", width: 800, height: 800, alt: "Kỹ sư FireTech E&C trao đổi cùng các bên tại hiện trường một nhà ga tàu điện ngầm",
  },
  {
    id: "instructor", kind: "image", purpose: "Ảnh người trao đổi cùng bạn", ratio: "1/1", recommended: IMG_11,
    src: "media/nguoi-trao-doi.webp", width: 800, height: 800, alt: "Chân dung người trao đổi cùng bạn",
  },
  {
    id: "contact-fire", kind: "image", purpose: "Ảnh ngọn lửa", ratio: "1/1", recommended: IMG_11,
    src: "media/lien-he-ngon-lua.webp", width: 800, height: 800, alt: "Ngọn lửa bùng cháy trên nền tối",
  },
]

/** Hình và video của từng tình huống: ảnh mô hình + video trích đoạn (hoặc liên kết YouTube). */
const SCENARIO_MEDIA: Record<string, { image: string; alt: string; video: Pick<MediaSlotDef, "kind" | "src" | "poster" | "href" | "alt"> }> = {
  "ga-tau-dien-ngam": {
    image: "media/tinh-huong/ga-tau-dien-ngam.webp",
    alt: "Mô hình nhà ga ngầm dạng khung dây, dải nhiệt độ của lớp khói dọc tầng ke ga",
    video: { kind: "youtube", src: "media/tinh-huong/ga-tau-dien-ngam.webp", href: "https://www.youtube.com/watch?v=rZDpHL6DAWA&t=60s", alt: "Mô phỏng khói lan trong nhà ga tàu điện ngầm (mở trên YouTube)" },
  },
  "kho-ke-cao": {
    image: "media/tinh-huong/kho-ke-cao.webp",
    alt: "Mô hình nhà kho kệ cao dạng khung dây, lớp khói tích tụ dưới trần",
    video: { kind: "video", src: "media/tinh-huong/kho-ke-cao.mp4", poster: POSTER("kho-ke-cao"), alt: "Mô phỏng khói lan trong kho kệ cao và thời điểm sprinkler kích hoạt" },
  },
  "kho-ba-tang": {
    image: "media/tinh-huong/kho-ba-tang.webp",
    alt: "Mô hình nhà kho ba tầng dạng khung dây",
    video: { kind: "video", src: "media/tinh-huong/kho-ba-tang.mp4", poster: POSTER("kho-ba-tang"), alt: "Nhà kho ba tầng: nhiệt độ lan trong công trình, so sánh phát hiện cháy sớm và muộn" },
  },
  "nha-xuong-cong-nghiep": {
    image: "media/tinh-huong/nha-xuong-cong-nghiep.webp",
    alt: "Mô hình nhà xưởng dạng khung dây, khói lan dưới mái theo nồng độ",
    video: { kind: "video", src: "media/tinh-huong/nha-xuong-cong-nghiep.mp4", poster: POSTER("nha-xuong-cong-nghiep"), alt: "Mô phỏng quá trình khói phát triển trong nhà xưởng công nghiệp" },
  },
  "vien-duong-lao": {
    image: "media/tinh-huong/vien-duong-lao.webp",
    alt: "Mô hình viện dưỡng lão nhiều tầng dạng khung dây",
    video: { kind: "video", src: "media/tinh-huong/vien-duong-lao.mp4", poster: POSTER("vien-duong-lao"), alt: "Viện dưỡng lão: hộ lý hỗ trợ người ngồi xe lăn thoát nạn" },
  },
}

const derived: MediaSlotDef[] = [
  ...scenarios.flatMap((sc): MediaSlotDef[] => {
    const m = SCENARIO_MEDIA[sc.id]
    return [
      { id: `scenario-${sc.id}`, kind: "image", purpose: `Mô hình: ${sc.name}`, ratio: "16/9", recommended: IMG_169, src: m?.image ?? "", alt: m?.alt, width: 1280, height: 720, label: "Mô hình mô phỏng" },
      { id: `scenario-${sc.id}-video`, purpose: `Video trích đoạn: ${sc.name}`, ratio: "16/9", recommended: VIDEO_MP4, label: "Video trích đoạn 30 giây", ...(m ? { ...m.video } : { kind: "video" as const, src: "" }) },
    ]
  }),
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
