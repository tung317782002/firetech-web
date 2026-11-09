# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dự án

`firetech-web` là mã nguồn website **firetech.edu.vn** — nền tảng đào tạo và tư vấn mô phỏng cháy, thoát nạn chuyên sâu bằng **PyroSim**, **FDS** (Fire Dynamics Simulator) và **Pathfinder**, theo các tiêu chuẩn **QCVN 06**, **NFPA** và **NGA**.

Đối tượng là kỹ sư PCCC, tư vấn thiết kế, thẩm duyệt. Nội dung chủ yếu bằng tiếng Việt, nên giữ đúng thuật ngữ chuyên ngành: tên phần mềm (PyroSim, FDS, Pathfinder), mã tiêu chuẩn (QCVN 06:2022/BXD, NFPA 101/92…), và các khái niệm như HRR, ASET/RSET, tầm nhìn, nồng độ CO, nhiệt độ lớp khói. Không dịch các tên này hay viết khác đi.

## Phạm vi chức năng (định hướng của chủ dự án)

Website của công ty về ứng dụng và sử dụng phần mềm mô phỏng cháy, thoát nạn. Có bốn nhóm chức năng chính:

1. **Thao tác trực tiếp với phần mềm**: người dùng tương tác ngay trên web (demo, mô phỏng hoặc trình xem kết quả). PyroSim, Pathfinder và FDS là phần mềm desktop, không chạy được trong trình duyệt. Phần này hiện được làm dạng trình mô phỏng minh họa (thanh trượt so sánh CAD/Revit thô với mô hình cháy và thoát nạn) kèm máy tính nhanh trong thư viện. Muốn chuyển sang trình xem kết quả thật (dữ liệu Smokeview/Pathfinder) hoặc truy cập phần mềm từ xa thì phải hỏi chủ dự án trước.
2. **Thông tin sản phẩm**: các trang giới thiệu PyroSim, Pathfinder, FDS và dịch vụ tư vấn, có theo dõi thông tin/phiên bản sản phẩm.
3. **Đăng ký khoá học**: danh mục khoá học, lịch học, form đăng ký (dùng JSON-LD `Course` cho trang khoá học).
4. **Tra cứu thư viện**: tài liệu, tiêu chuẩn, mô hình mẫu và vật liệu, có tìm kiếm và lọc.

Hai phần đăng ký khoá học và tra cứu thư viện cần backend hoặc CMS (lưu đăng ký, quản lý tài liệu). Chọn stack phải tính đến điều này.

## Stack và lệnh

Site **tĩnh thuần HTML/CSS/JS**, không có bước build, không package manager, không phụ thuộc mạng ngoài (font hệ thống, không CDN). Giữ như vậy trừ khi chủ dự án yêu cầu đổi stack (khi đó phải chuyển đủ SEO/meta bên dưới).

```bash
python3 -m http.server 8080          # chạy site tại http://localhost:8080
node scripts/kiem-tra.js             # kiểm thử Playwright (cần server đang chạy); thoát mã 1 nếu có lỗi
node scripts/kiem-tra.js http://localhost:8080/index.html /đường/dẫn/lưu/ảnh   # kèm ảnh chụp từng cỡ màn hình
node scripts/kiem-config.js         # liệt kê giá trị mẫu còn lại trong config.js (mã 1 nếu còn); chạy trước khi công bố
```

`kiem-tra.js` chạy 100+ kiểm tra: 0 lỗi console/pageerror/request lỗi, không cuộn ngang ở 320–1440px, kéo thả/phím/click phòng/đặt lại/tải PNG-CSV-xlsx, bộ lọc, máy tính nhanh, dialog, form, SEO. Không có lệnh chạy riêng một test: sửa/comment phần liên quan trong file. Không có lint.

## Kiến trúc

- `index.html`: toàn bộ trang một file; nội dung tĩnh (hero, quy trình, FAQ, footer), `<head>` có SEO và JSON-LD. Các danh sách động chỉ có khung rỗng (`#topic-list`, `#lib-list`, `#plans`, `#zalo-list`, `#stats`), JS đổ dữ liệu vào.
- `assets/js/config.js`: **nơi duy nhất thay thông tin đơn vị**: SĐT, email, Zalo, nhóm Zalo, gói học phí, `registerEndpoint`. Mọi giá trị hiện tại là **mẫu**. HTML nhận giá trị qua thuộc tính `data-cfg`, `data-cfg-tel`, `data-cfg-mail`, `data-cfg-href`.
- `assets/js/data.js`: đề tài đồ án, thư viện (công thức/Excel/bài viết), và các hàm máy tính nhanh (`calcs`). Thêm phần tử vào mảng là trang, bộ lọc và số liệu thống kê tự cập nhật.
- `assets/js/main.js`: toàn bộ tương tác. Phần trình mô phỏng (`Plan`, `initSim`, `initHero`) dựng mặt bằng bằng **hàm thuần trả chuỗi SVG** (`renderCad`, `renderSim`, `compose`), dùng chung cho hero, khung tương tác và tải PNG (SVG → canvas), nên chỉnh hình học ở một chỗ (`ROOMS`, `EXITS`, `FIRE`). Người thoát nạn sinh bằng PRNG có seed cố định nên kết quả (RSET, CSV) lặp lại được. Các số RSET/ASET chỉ để minh họa, không phải tính toán công trình thật.
- `assets/css/styles.css`: token màu/khoảng cách ở `:root`; lớp `.js` trên `<html>` do JS thêm, hiệu ứng `.reveal` chỉ ẩn khi có `.js`.
- `assets/downloads/*.xlsx`: bảng tính thật (có công thức), tạo bằng `openpyxl`; khi sửa phải kiểm tra lại giá trị (ví dụ mở bằng LibreOffice headless chuyển CSV). Đường dẫn khai báo trong `data.js`.
- Form đăng ký không có backend. Nếu `registerEndpoint` rỗng, form chỉ chuẩn bị nội dung để gửi qua Zalo/email và **nói rõ chưa gửi**. Đừng đổi thành thông báo "đã gửi" khi chưa có endpoint.

Khi thêm tài liệu Excel/bài viết, nhớ khớp nội dung JSON-LD `FAQPage`/`Course` trong `index.html` (viết tay, không tự sinh từ `data.js`).

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
