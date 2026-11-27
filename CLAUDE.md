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

Repo có **hai bản** của cùng một trang: bản **tĩnh thuần HTML/CSS/JS ở gốc repo** (không build, không package manager, không phụ thuộc mạng ngoài, mô tả ngay dưới đây) và bản **React trong `web/`** (xem mục "Bản React trong web/"). Bản tĩnh giữ làm dự phòng cho đến khi chủ dự án quyết định thay bằng bản React; cả hai phải giữ đủ SEO/meta bên dưới. **Từ nội dung 2.0, bản React có cấu trúc và chữ khác bản tĩnh** (7 mục theo tài liệu "FireTech – Nội dung web", không ghi học phí, không có trình mô phỏng kéo thả); bản tĩnh vẫn mang nội dung cũ có giá và chỉ là bản dự phòng.

```bash
python3 -m http.server 8080          # chạy site tại http://localhost:8080
node scripts/kiem-tra.js             # kiểm thử Playwright cho BẢN TĨNH (cần server đang chạy); thoát mã 1 nếu có lỗi
node scripts/kiem-tra.js http://localhost:8080/index.html /đường/dẫn/lưu/ảnh   # kèm ảnh chụp từng cỡ màn hình
node scripts/kiem-config.js         # liệt kê giá trị mẫu còn lại trong config.js (mã 1 nếu còn); chạy trước khi công bố
```

`scripts/kiem-tra.js` (chỉ dùng cho bản tĩnh) chạy 120+ kiểm tra (gồm 5 thiết bị cảm ứng giả lập iPhone/Pixel/Galaxy/iPad): 0 lỗi console/pageerror/request lỗi, không cuộn ngang ở 320–1440px, kéo thả/phím/click phòng/đặt lại/tải PNG-CSV-xlsx, bộ lọc, máy tính nhanh, dialog, form, SEO. Không có lệnh chạy riêng một test: sửa/comment phần liên quan trong file. Không có lint.

## Kiến trúc

- `index.html`: toàn bộ trang một file; nội dung tĩnh (hero, quy trình, FAQ, footer), `<head>` có SEO và JSON-LD. Các danh sách động chỉ có khung rỗng (`#topic-list`, `#lib-list`, `#plans`, `#zalo-list`, `#stats`), JS đổ dữ liệu vào.
- `assets/js/config.js`: **nơi duy nhất thay thông tin đơn vị**: SĐT, email, Zalo, nhóm Zalo, gói học phí, `registerEndpoint`. Thông tin liên hệ, nhóm Zalo và 2 gói học phí đã là số thật của đơn vị (cập nhật 11/2026); `registerEndpoint` để trống nên form gửi qua Zalo. HTML nhận giá trị qua thuộc tính `data-cfg`, `data-cfg-tel`, `data-cfg-mail`, `data-cfg-href`.
- `assets/js/data.js`: đề tài đồ án, thư viện (công thức/Excel/bài viết), và các hàm máy tính nhanh (`calcs`). Thêm phần tử vào mảng là trang, bộ lọc và số liệu thống kê tự cập nhật.
- `assets/js/main.js`: toàn bộ tương tác. Phần trình mô phỏng (`Plan`, `initSim`, `initHero`) dựng mặt bằng bằng **hàm thuần trả chuỗi SVG** (`renderCad`, `renderSim`, `compose`), dùng chung cho hero, khung tương tác và tải PNG (SVG → canvas), nên chỉnh hình học ở một chỗ (`ROOMS`, `EXITS`, `FIRE`). Người thoát nạn sinh bằng PRNG có seed cố định nên kết quả (RSET, CSV) lặp lại được. Các số RSET/ASET chỉ để minh họa, không phải tính toán công trình thật.
- `assets/css/styles.css`: token màu/khoảng cách ở `:root`; lớp `.js` trên `<html>` do JS thêm, hiệu ứng `.reveal` chỉ ẩn khi có `.js`.
- `assets/downloads/*.xlsx`: bảng tính thật (có công thức), tạo bằng `openpyxl`; khi sửa phải kiểm tra lại giá trị (ví dụ mở bằng LibreOffice headless chuyển CSV). Đường dẫn khai báo trong `data.js`.
- Form đăng ký không có backend. Nếu `registerEndpoint` rỗng, form chỉ chuẩn bị nội dung để gửi qua Zalo/email và **nói rõ chưa gửi**. Đừng đổi thành thông báo "đã gửi" khi chưa có endpoint.

Khi thêm tài liệu Excel/bài viết, nhớ khớp nội dung JSON-LD `FAQPage`/`Course` trong `index.html` (viết tay, không tự sinh từ `data.js`).

## Bản React trong `web/`

Dựng bằng skill `web-artifacts-builder`: React 19, TypeScript, Vite, Tailwind 3.4, shadcn/ui; đóng gói bằng Parcel thành **một file `web/bundle.html`** (không commit: `bundle.html`, `dist/`, `.parcel-cache/`, `node_modules/` nằm trong `web/.gitignore`).

```bash
cd web && pnpm install
pnpm dev                              # chạy thử với Vite
pnpm exec tsc -b && pnpm lint         # kiểm tra kiểu và lint (cảnh báo trong src/components/ui/ là của mẫu shadcn)
pnpm bundle                           # ra web/bundle.html (một file: CSS, JS, font woff2 đã nhúng)
pnpm kiem-so-lieu                     # máy tính nhanh (D* = 0,959 m, RSET 195 s) và các bảng RSET/ASET của 5 tình huống: phép cộng, 1,5 × RSET, hệ số ASET/RSET
pnpm kiem-cau-hinh                    # giá trị mẫu còn lại trong config.ts (mã 1) và vị trí media còn trống (chỉ lưu ý)
pnpm tao-tin-tuc                      # sinh dữ liệu và trang tin tức từ web/tin-tuc/*.md (tự chạy trước dev/build/bundle)
node web/scripts/ghep-site.mjs        # ghép thư mục đăng web/site/ (bundle, media, trang tin, sitemap); workflow cũng dùng script này
node web/scripts/kiem-tin-tuc.cjs     # kiểm thử trang tin tĩnh và liên kết trang chủ → bài (chạy sau ghep-site, cần server tĩnh); 90+ kiểm tra
node web/scripts/kiem-tra.cjs        # kiểm thử Playwright cho bản React (160+ kiểm tra), chạy từ gốc repo sau pnpm bundle và ghep-site, cần server tĩnh; URL mặc định http://localhost:8080/web/site/
```

- `src/data/config.ts`: nơi duy nhất thay SĐT, email, Zalo, nhóm Zalo, `registerEndpoint` (cùng nội dung liên hệ với `assets/js/config.js` của bản tĩnh; sửa cả hai khi đổi thông tin liên hệ). `plans` (gói học phí) vẫn còn trong file nhưng **trang không hiển thị**: nội dung 2.0 không ghi giá. Muốn hiện lại phải thêm component và cập nhật JSON-LD, hỏi chủ dự án trước.
- `src/content/copy.ts`: **toàn bộ tiêu đề, đoạn dẫn, nhãn nút** ở một chỗ, chép sát tài liệu nội dung 2.0 (7 mục: trang chủ, Mô phỏng cháy là gì?, Công cụ, Tình huống mô phỏng, Thư viện mở, Chúng tôi là ai, Trao đổi). Giọng học thuật, chính xác; không dùng câu khoa trương; giữ nguyên thuật ngữ. `index.html` (title, description, JSON-LD `FAQPage` lấy từ 3 câu hỏi ở mục 2) phải khớp với nội dung hiển thị.
- `src/data/scenarios.ts`, `src/data/method.ts`: 5 tình huống mô phỏng (chữ khái quát, **không nêu bảng RSET/ASET hay cơ sở tính toán chi tiết** theo bản demo đã duyệt; bản chi tiết cũ nằm trong lịch sử git, PR #2) và phương pháp đánh giá chung (tiêu chí an toàn, hệ số 1,5, tài liệu tham chiếu) chép từ báo cáo dự án của đội ngũ FireTech E&C. Không bịa số; sửa thì chạy `pnpm kiem-so-lieu`.
- `src/data/topics.ts`, `library.ts`, `calcs.ts`: đề tài nghiên cứu khoa học cho sinh viên (nhóm nhỏ trong mục Thư viện, không còn phân "Cấp"), thư viện (công thức, Excel, bài viết, mẫu kịch bản/checklist, danh mục tiêu chuẩn), máy tính nhanh. `src/data/files.ts` là file **tự sinh** (4 bảng tính `.xlsx` dạng base64): chạy `node scripts/dong-goi-xlsx.mjs` sau khi sửa file trong `assets/downloads/`.
- **Vị trí ảnh/video** nằm hết trong `src/data/media.ts`, hiển thị qua `MediaSlot` (loại `image`, `video` có poster, `embed`, `youtube` = ảnh bìa + nút phát mở YouTube ở tab mới): `src` trống thì hiện khung giữ chỗ đúng tỉ lệ. Hiện còn **9 vị trí trống** chờ ảnh của chủ dự án: 3 ảnh đề tài (`topic-rset-trung-tam-thuong-mai`, `topic-sfpe-so-voi-steering`, `topic-revit-sang-mo-phong`) và 6 ảnh bìa bài viết (`article-*`). Ảnh các đề tài còn lại nằm ở `web/public/media/de-tai/` (ảnh gốc rộng khoảng 973 px, nhỏ hơn quy cách 1280 px). Tệp media nằm ở `web/public/media/**` và `web/public/tin-tuc/**` (video đã nén H.264 không âm thanh, mỗi tệp dưới 4 MB), được đăng cùng web và tham chiếu bằng đường dẫn tương đối `media/...`; **mở `bundle.html` độc lập sẽ không thấy các tệp này** (chỉ logo được nhúng). Quy cách và cách thêm: `web/MEDIA.md`. Thêm vị trí mới thì khai báo ở `media.ts` rồi gắn `<MediaSlot id="..." />`.
- `scripts/dong-goi.mjs` thay bước `html-inline` của script mẫu: `html-inline` làm hỏng thẻ `canonical` và không nhúng font. Giữ nguyên các thẻ `<link>` SEO và favicon dạng data URI trong `web/index.html` (Parcel không resolve `/favicon.svg`).
- Bộ kiểm thử bản React dùng các móc giao diện cố định: `#hero-questions`, `#cau-hoi-1..3`, `#th-<mã tình huống>` (mục accordion, thuộc tính `data-state`), `.scenario`, `#phuong-phap`, `#lib-*`, `.doc`, `#article-body`, `#de-tai`, `.topic`, `#topic-*`, `#f-name/#f-phone/#f-note`, `#reg-*`, `#zalo-list`, `[data-slot-empty]`, `[data-media]`. Đổi tên các móc này thì phải sửa `web/scripts/kiem-tra.cjs`.
- **Logo và tên thương hiệu:** tên hiển thị là **FireTech E&C** (`config.brand.name`; tên miền vẫn `firetech.edu.vn`). Logo là `web/public/media/logo.webp` (+ `logo.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`), nền trong suốt. Thay logo: ghi đè các file này rồi chạy `node scripts/dong-goi-logo.mjs` (sinh `src/data/logo.ts` nhúng logo vào bundle để hiện cả khi mở file độc lập); đổi favicon data URI trong `web/index.html`, `favicon.svg` và `assets/img/og.png` ở gốc. Trang tin tĩnh dùng `media/logo.webp` qua đường dẫn tương đối.
- **Tin tức:** mỗi tin là một file `web/tin-tuc/YYYY-MM-DD-slug.md` (hướng dẫn và khóa front matter: `web/tin-tuc/README.md`, mẫu `_mau.md`). `scripts/tao-tin-tuc.mjs` kiểm tra dữ liệu (lỗi thì thoát mã 1, build dừng, web giữ bản cũ), lọc tin có ngày ở tương lai theo giờ Việt Nam, rồi sinh `src/data/news.generated.ts` (nhúng vào trang chủ, **không commit**) và `web/dist-tin/` (trang danh sách `/tin-tuc/`, từng bài `/tin-tuc/<slug>/` có canonical, Open Graph, JSON-LD `NewsArticle`, `feed.xml`, `sitemap.xml` và font dùng chung; không commit). `sitemap.xml` được đăng là bản sinh, không phải file ở gốc repo. Trên trang chủ, `NewsTicker` (băng tin chạy ngang, dừng khi rê chuột/focus/chạm giữ/nút, tắt khi giảm chuyển động) và `NewsFeatured` đặt trên Hero; hai khối tự ẩn khi không có tin. Đổi tên các móc `#news-ticker`, `#news-ticker-pause`, `#news-featured`, `.news-card`, `#tin-tuc` thì phải sửa `kiem-tra.cjs` và `kiem-tin-tuc.cjs`. Trang bài tĩnh nằm ngoài React nên tự có header/footer và CSS riêng trong `tao-tin-tuc.mjs`.
- **Đăng web:** `.github/workflows/dang-web.yml` build `web/` (tsc, `pnpm kiem-so-lieu`, `pnpm bundle`) rồi đăng lên GitHub Pages mỗi lần có commit vào `main` và mỗi ngày lúc 00:10 giờ Việt Nam (cron, để tin hẹn ngày tự hiện); pull request chỉ chạy bước build. Workflow cài `marked` qua pnpm và chạy `pnpm tao-tin-tuc` trước tsc. Thư mục đăng do `web/scripts/ghep-site.mjs` ghép: `web/bundle.html` làm `index.html`, `robots.txt`, `favicon.svg`, `assets/img/og.png`, `web/public/` (media, ảnh tin) và `web/dist-tin/` (tin tức, feed, font, `sitemap.xml` sinh), rồi kiểm canonical/JSON-LD. Cần bật một lần Settings → Pages → Source: GitHub Actions. Bản tĩnh ở gốc không còn được đăng; muốn đổi/thêm file vào thư mục đăng thì sửa `ghep-site.mjs`. Workflow không chạy bộ kiểm thử Playwright.
- Dùng TypeScript 7 nên **không có `baseUrl`** trong tsconfig; Parcel cần `"@parcel/resolver-default": { "packageExports": true }` trong `package.json` để đọc các gói Radix.

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
- **Gộp tự động (chủ dự án đã cho phép lâu dài):** mỗi lần chủ dự án yêu cầu sửa thêm, làm xong thì mở PR, đợi bước build của PR đạt, **gộp PR vào `main`** (kiểu merge commit, không cần chủ dự án nhắc lại), rồi theo dõi workflow `dang-web.yml` đến khi đăng xong và báo kết quả. Chỉ gộp PR do chính yêu cầu đó tạo ra. Không gộp khi build lỗi, khi PR có xung đột hoặc khi chủ dự án nói chờ/không gộp; khi đó dừng và báo lý do. Vẫn không commit thẳng lên `main` và không gộp PR của người khác.
- Không commit file build, `node_modules`, `.env` hay file mô phỏng nặng (`.fds`, `.psm`, `.pth`, kết quả `.smv`/`.q`). Nếu cần file mẫu để tải về, dùng Git LFS hoặc lưu trữ ngoài.
