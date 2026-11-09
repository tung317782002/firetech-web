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

| Mã | Loại | Tỉ lệ | Dùng cho |
|---|---|---|---|
| `logo` | ảnh | 4:1 | Logo đơn vị ở header, footer |
| `hero-video` | embed/video | 16:9 | Video giới thiệu khóa học (đầu trang, cạnh trình mô phỏng) |
| `software-pyrosim`, `software-pathfinder`, `software-fds` | ảnh | 16:9 | Ảnh màn hình từng phần mềm, mục "Phần mềm" |
| `topic-<mã đề tài>` (9 vị trí, mã lấy từ `src/data/topics.ts`) | ảnh | 16:9 | Ảnh minh họa từng đề tài |
| `article-<mã bài>` (4 vị trí, mã lấy từ `src/data/library.ts`) | ảnh | 16:9 | Ảnh bìa bài viết trong thư viện |
| `result-1` … `result-6` | ảnh | 4:3 | Kết quả mô phỏng của học viên |
| `course-pyrosim-pathfinder`, `course-fds-edit-video-bao-cao` | ảnh | 16:9 | Ảnh giới thiệu từng gói học phí |
| `instructor` | ảnh | 1:1 | Ảnh giảng viên |
| `zalo-qr` | ảnh | 1:1 | Mã QR nhóm Zalo |

Vị trí mới thêm ở `src/data/media.ts` (mảng `fixed`) rồi gắn `<MediaSlot id="..." />` vào đúng khối.

Ảnh chia sẻ mạng xã hội (Open Graph) không nằm ở đây: sửa thẻ `og:image` trong `web/index.html`.
