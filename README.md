# firetech-web
firetech.edu.vn - Nền tảng đào tạo & tư vấn mô phỏng cháy, thoát nạn chuyên sâu (PyroSim, FDS, Pathfinder) theo tiêu chuẩn QCVN 06 / NFPA / NGA.

## Trước khi công bố

Thông tin liên hệ, nhóm Zalo và học phí nằm trong `assets/js/config.js`. Chạy lệnh sau để kiểm tra còn giá trị mẫu nào chưa thay (thoát mã 1 nếu còn; `registerEndpoint` trống chỉ là lưu ý):

```bash
node scripts/kiem-config.js
```

Chạy site: `python3 -m http.server 8080`. Kiểm thử giao diện: `node scripts/kiem-tra.js`.
