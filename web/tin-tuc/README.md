# Đăng tin tức

Mỗi tin là một file Markdown trong thư mục này. Sau khi gộp vào `main`, trang tự build và đăng; tin mới nhất tự lên đầu trang chủ, băng tin chạy ngang và trang `/tin-tuc/`.

## Cách thêm một tin
1. Sao chép `_mau.md`, đổi tên thành `YYYY-MM-DD-slug.md` (ví dụ `2026-11-17-quy-chuan-moi.md`). Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang; slug thành địa chỉ `/tin-tuc/<slug>/`.
2. Điền phần đầu (giữa hai dòng `---`) và viết nội dung bằng Markdown.
3. Nếu có ảnh: đặt vào `web/public/tin-tuc/` (WebP, rộng tối thiểu 1280 px, dưới 300 KB) và điền `anh: tin-tuc/ten-anh.webp` cùng `anh_alt`.
4. Mở pull request rồi gộp vào `main`. Trên GitHub có thể làm hết bằng "Add file" → "Create new file" (kể cả trên điện thoại).

## Phần đầu của file
| Khóa | Bắt buộc | Ý nghĩa |
|---|---|---|
| `tieu_de` | có | Tiêu đề tin |
| `ngay` | có | `YYYY-MM-DD`, phải trùng ngày trong tên file. Ngày ở tương lai thì tin **chưa hiện** và tự hiện đúng hôm đó (web dựng lại mỗi ngày lúc 00:10 giờ Việt Nam) |
| `tom_tat` | có | 1–2 câu, dùng cho thẻ tin, mô tả trang, chia sẻ mạng xã hội |
| `anh`, `anh_alt` | không | Có `anh` thì bắt buộc `anh_alt` (mô tả bằng tiếng Việt) |
| `nhan` | không | Nhãn ngắn |
| `nguon` | không | Tin tổng hợp thì nêu nguồn |

File có lỗi (thiếu khóa, sai ngày, trùng slug…) làm bước build báo lỗi kèm tên file và **web giữ nguyên bản cũ**.

## Chạy thử trên máy
```bash
cd web && pnpm install
pnpm tao-tin-tuc      # kiểm tra và sinh trang vào web/dist-tin/
pnpm dev              # xem trang chủ
```
