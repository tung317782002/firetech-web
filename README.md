# firetech-web
firetech.edu.vn - Nền tảng đào tạo & tư vấn mô phỏng cháy, thoát nạn chuyên sâu (PyroSim, FDS, Pathfinder) theo tiêu chuẩn QCVN 06 / NFPA / NGA.

## Trước khi công bố

Số điện thoại, email, liên kết Zalo, link nhóm Zalo, giá/lịch học và `registerEndpoint` trong `assets/js/config.js` hiện là **giá trị mẫu**. Chạy lệnh sau để biết còn mục nào chưa thay (thoát mã 1 nếu còn):

```bash
node scripts/kiem-config.js
```

Chạy site: `python3 -m http.server 8080`. Kiểm thử giao diện: `node scripts/kiem-tra.js`.
