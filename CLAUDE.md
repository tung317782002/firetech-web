# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dự án

`firetech-web` là mã nguồn website **firetech.edu.vn** — nền tảng đào tạo và tư vấn mô phỏng cháy, thoát nạn chuyên sâu bằng **PyroSim**, **FDS** (Fire Dynamics Simulator) và **Pathfinder**, theo các tiêu chuẩn **QCVN 06**, **NFPA** và **NGA**.

Đối tượng là kỹ sư PCCC, tư vấn thiết kế, thẩm duyệt. Nội dung chủ yếu bằng tiếng Việt, nên giữ đúng thuật ngữ chuyên ngành: tên phần mềm (PyroSim, FDS, Pathfinder), mã tiêu chuẩn (QCVN 06:2022/BXD, NFPA 101/92…), và các khái niệm như HRR, ASET/RSET, tầm nhìn, nồng độ CO, nhiệt độ lớp khói. Không dịch các tên này hay viết khác đi.

## Trạng thái repo

Khi tạo file này (11/2026), repo mới chỉ có `README.md`: chưa chọn framework, chưa có package manager, chưa có lệnh build/lint/test. Khi có stack, hãy **bổ sung vào file này**: lệnh dev/build/lint/test (kể cả cách chạy một test), cấu trúc thư mục chính và nơi khai báo SEO/meta. Đừng giả định có lệnh nào mà repo chưa có.

## Quy tắc frontend

- Dùng HTML ngữ nghĩa (`header`, `nav`, `main`, `article`, `section`, `footer`). Mỗi trang chỉ có **một `<h1>`**, các heading không nhảy cấp.
- Component nhỏ, mỗi component một việc. Không để code chết, `console.log` hay comment đã tắt. Không thêm thư viện mới nếu thứ đang có làm được.
- Màu, khoảng cách và font đặt thành biến/token dùng chung, không hard-code rải rác.
- Ảnh luôn có `alt` mô tả bằng tiếng Việt, có `width`/`height`, ảnh nằm dưới màn hình đầu thì lazy-load. Ưu tiên WebP/AVIF.
- Responsive từ mobile trở lên, không để trang cuộn ngang. Cần đạt mức truy cập cơ bản: tương phản đủ, focus nhìn thấy được, form có `label`.
- Nội dung `lang="vi"`, mã hoá UTF-8. Không để HTML entity bị escape thừa (ví dụ `&amp;amp;`) — README hiện có một chỗ `&amp;` hiển thị sai.

## SEO/meta: không được làm mất

Khi sửa layout, template, head component hay khi refactor/đổi framework, **giữ nguyên hoặc chuyển đầy đủ** những thẻ sau. Nếu một thay đổi buộc phải xoá hay đổi chúng, phải nói rõ với người dùng trước.

- `<title>` và `<meta name="description">` riêng cho từng trang.
- `<link rel="canonical">` trỏ về `https://firetech.edu.vn/...`.
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale=vi_VN`) và Twitter Card.
- `<meta name="viewport">`, `<html lang="vi">`, favicon/manifest.
- Dữ liệu có cấu trúc JSON-LD (ví dụ `Organization`, `Course`, `BreadcrumbList`, `FAQPage`) — giữ hợp lệ, không làm hỏng JSON.
- `robots.txt`, `sitemap.xml`, `hreflang` (nếu có), mã xác minh Search Console/Analytics.
- URL/slug đang dùng: không đổi. Nếu bắt buộc đổi, phải thêm redirect 301.

Sau khi sửa phần head/layout, so sánh các thẻ trước và sau thay đổi (xem trong HTML đã build hoặc đã render) để chắc chắn không mất thẻ nào.

## Quy ước Git

- Commit theo **Conventional Commits**: `<type>(<scope>): <mô tả ngắn>`
  - type: `feat`, `fix`, `style`, `refactor`, `perf`, `docs`, `content`, `seo`, `chore`, `build`, `ci`, `test`
  - Ví dụ: `feat(khoa-hoc): thêm trang khoá học PyroSim cơ bản`, `seo(home): bổ sung JSON-LD Organization`
- Dòng tiêu đề tối đa khoảng 72 ký tự, ở thể mệnh lệnh, tiếng Việt hoặc tiếng Anh nhưng thống nhất trong một commit. Phần thân giải thích *vì sao* thay đổi.
- Mỗi commit một thay đổi logic. Không gộp thay đổi nội dung với refactor.
- Không commit thẳng lên `main`: làm trên nhánh `feat/...`, `fix/...`, `content/...` rồi mở PR.
- Không commit file build, `node_modules`, `.env` hay file mô phỏng nặng (`.fds`, `.psm`, `.pth`, kết quả `.smv`/`.q`). Nếu cần file mẫu để tải về, dùng Git LFS hoặc lưu trữ ngoài.
