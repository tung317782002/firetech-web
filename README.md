# firetech-web
firetech.edu.vn - Nền tảng đào tạo & tư vấn mô phỏng cháy, thoát nạn chuyên sâu (PyroSim, FDS, Pathfinder) theo tiêu chuẩn QCVN 06 / NFPA / NGA.

## Trước khi công bố

Thông tin liên hệ, nhóm Zalo và học phí nằm trong `assets/js/config.js`. Chạy lệnh sau để kiểm tra còn giá trị mẫu nào chưa thay (thoát mã 1 nếu còn; `registerEndpoint` trống chỉ là lưu ý):

```bash
node scripts/kiem-config.js
```

Chạy site: `python3 -m http.server 8080`. Kiểm thử giao diện: `node scripts/kiem-tra.js`.

## Bản React (`web/`)

Bản dựng lại bằng React + TypeScript + Tailwind + shadcn/ui, đóng gói thành một file HTML. Bản tĩnh ở gốc repo vẫn giữ làm dự phòng.

```bash
cd web && pnpm install && pnpm bundle      # tạo web/bundle.html
pnpm kiem-so-lieu && pnpm kiem-cau-hinh   # số liệu mô phỏng, giá trị mẫu và vị trí ảnh/video còn trống
```

Thông tin liên hệ và học phí: `web/src/data/config.ts`. Chữ trên trang: `web/src/content/copy.ts`. Thêm ảnh, video: `web/MEDIA.md`.
