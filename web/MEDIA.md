# Vị trí ảnh và video

Mọi chỗ đặt hình trên trang đều đã được khai báo sẵn và **để trống**. Chỗ trống hiện khung giữ chỗ có nét đứt, ghi tên vị trí và quy cách, và **giữ đúng tỉ lệ khung** nên khi thêm ảnh thật bố cục không bị xô. Rê chuột lên khung giữ chỗ để xem mã vị trí.

## Cách thêm ảnh hoặc video (3 bước)

1. **Đặt file** vào `web/public/media/` (ví dụ `web/public/media/pyrosim.webp`) hoặc dùng liên kết ngoài (YouTube, Google Drive).
2. **Điền `src` và `alt`** của vị trí đó trong `src/data/media.ts`:

   ```ts
   { id: "software-pyrosim", ..., src: "media/pyrosim.webp", alt: "Giao diện PyroSim khi dựng mô hình tầng hầm", width: 1280, height: 720 }
   ```

   - Ảnh: bắt buộc có `alt` tiếng Việt mô tả nội dung (không viết "ảnh của…"); điền `width`, `height` thật của ảnh.
   - Video: điền `alt` làm tiêu đề, `poster` là ảnh bìa; `kind: "video"` cho file MP4, `kind: "embed"` cho YouTube/Drive (liên kết YouTube thường tự đổi sang `youtube-nocookie.com`).
   - `caption` (tùy chọn) hiện dưới hình.
3. **Build lại**: `pnpm bundle` (xem README ở gốc repo).

Ảnh lỗi tải sẽ tự quay về khung giữ chỗ, không hiện biểu tượng ảnh hỏng. Bản đóng gói là một file HTML nên **không nhúng tư liệu nặng vào file**: đặt thư mục `media/` cạnh `bundle.html` khi triển khai hoặc dùng liên kết ngoài.

## Quy cách khuyến nghị

- **Ảnh:** WebP hoặc AVIF; ảnh 16:9 tối thiểu 1280×720 và dưới 300 KB; ảnh 4:3 tối thiểu 1024×768; ảnh vuông tối thiểu 800×800.
- **Video:** MP4 (H.264) 1920×1080, dưới 50 MB, hoặc liên kết YouTube/Drive; nên có ảnh bìa (`poster`) và phụ đề.
- **Logo:** SVG hoặc PNG nền trong suốt, cao khoảng 64 px. Khi có `src` của `logo`, header và footer tự thay logo mặc định.
- **Mã QR Zalo:** PNG tối thiểu 512×512.

## Danh sách vị trí

| Mã | Loại | Tỉ lệ | Trạng thái / dùng cho |
|---|---|---|---|
| `logo` | ảnh | 846:186 | Đã có (nhúng từ `public/media/logo.webp`; thay file rồi chạy `node scripts/dong-goi-logo.mjs`) |
| `hero-video` | youtube | 16:9 | Đã có: ảnh bìa + liên kết YouTube mở tab mới |
| `concepts-aset-rset` | ảnh (SVG) | 16:9 | Đã có: sơ đồ ASET/RSET |
| `concepts-video` | video | 16:9 | Đã có: mô phỏng chung cư cao tầng (48 s) |
| `concepts-smoke`, `concepts-visibility`, `concepts-crowd`, `concepts-density` | ảnh | 4:3 | Đã có: khói, tầm nhìn, dòng người, mật độ người |
| `software-pyrosim`, `software-pathfinder`, `software-fds` | ảnh | 16:9 | Đã có |
| `scenario-<mã>` và `scenario-<mã>-video` (5 tình huống, mã lấy từ `src/data/scenarios.ts`) | ảnh + video/youtube | 16:9 | Đã có: ảnh mô hình và video trích đoạn (ga tàu điện ngầm dùng YouTube) |
| `contact-site`, `instructor`, `contact-fire` | ảnh | 1:1 | Đã có: hàng 3 ảnh ở khối liên hệ |
| `topic-<mã đề tài>` (9 vị trí, mã lấy từ `src/data/topics.ts`) | ảnh | 16:9 | `topic-kho-xep-gia` đã có; **8 vị trí còn trống**: chờ ảnh (`khoi-ham-do-xe`, `rset-trung-tam-thuong-mai`, `thang-bo-chung-cu`, `khoi-thong-tang`, `hanh-lang-truong-hoc`, `be-rong-loi-thoat`, `sfpe-so-voi-steering`, `revit-sang-mo-phong`) |
| `article-<mã bài>` (6 vị trí: `bv-luoi`, `bv-rset`, `bv-revit`, `bv-ketqua`, `bv-tieu-chi`, `bv-hrr`) | ảnh | 16:9 | **Còn trống**: chờ ảnh bìa |

Video: H.264 (MP4), không âm thanh, dưới 4 MB, kèm ảnh bìa JPG (`poster`); nén bằng `ffmpeg -an -c:v libx264 -preset slow -crf 29 -movflags +faststart`. Tệp đặt trong `web/public/media/` và tham chiếu bằng `media/...` (không nhúng vào bundle).

Vị trí mới thêm ở `src/data/media.ts` (mảng `fixed`) rồi gắn `<MediaSlot id="..." />` vào đúng khối.

Ảnh chia sẻ mạng xã hội (Open Graph) không nằm ở đây: sửa thẻ `og:image` trong `web/index.html`.
