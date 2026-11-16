# firetech-web
firetech.edu.vn - Nền tảng đào tạo & tư vấn mô phỏng cháy, thoát nạn chuyên sâu (PyroSim, FDS, Pathfinder) theo tiêu chuẩn QCVN 06 / NFPA / NGA.

## Trước khi công bố

Thông tin liên hệ, nhóm Zalo và học phí nằm trong `assets/js/config.js`. Chạy lệnh sau để kiểm tra còn giá trị mẫu nào chưa thay (thoát mã 1 nếu còn; `registerEndpoint` trống chỉ là lưu ý):

```bash
node scripts/kiem-config.js
```

Chạy site: `python3 -m http.server 8080`. Kiểm thử giao diện bản tĩnh: `node scripts/kiem-tra.js`.

## Bản React (`web/`)

Bản dựng lại bằng React + TypeScript + Tailwind + shadcn/ui, đóng gói thành một file HTML. Bản tĩnh ở gốc repo vẫn giữ làm dự phòng.

```bash
cd web && pnpm install && pnpm bundle      # tạo web/bundle.html
pnpm kiem-so-lieu && pnpm kiem-cau-hinh   # số liệu RSET/ASET và máy tính nhanh, giá trị mẫu và vị trí ảnh/video còn trống
```

Tin tức: thêm file `web/tin-tuc/NGÀY-slug.md` (xem `web/tin-tuc/README.md`); tin mới nhất tự lên đầu trang chủ, băng tin và `/tin-tuc/`, mỗi tin có trang riêng.

Đăng web: mỗi lần có commit vào `main` và mỗi ngày lúc 00:10 giờ Việt Nam, `.github/workflows/dang-web.yml` tự build `web/` và đăng lên GitHub Pages (bật một lần: Settings → Pages → Source: GitHub Actions).

Kiểm thử giao diện (cần server tĩnh `python3 -m http.server 8080` ở gốc repo): `node web/scripts/kiem-tra.cjs`.

Thông tin liên hệ: `web/src/data/config.ts`. Chữ trên trang: `web/src/content/copy.ts`. Tình huống mô phỏng và số liệu: `web/src/data/scenarios.ts`, `method.ts`. Thêm ảnh, video: `web/MEDIA.md`. Nội dung 2.0 không ghi học phí.
