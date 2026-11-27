---
tieu_de: Kho hàng gia dụng: mô phỏng cửa tự mở theo tín hiệu đầu báo khói
ngay: 2026-11-24
tom_tat: Trong một kho hàng hóa gia dụng, cửa thoát nạn được lập trình tự mở khi đầu báo khói kích hoạt; mô phỏng cho thấy cửa mở chưa đầy một phút sau khi cháy và khí độc tại lối thoát luôn ở mức rất thấp.
nhan: Dự án thực tế
anh: tin-tuc/kho-hang-mo-hinh.webp
anh_alt: Phối cảnh mô hình PyroSim của một khu nhà kho và xưởng sản xuất
nguon: Báo cáo dự án của đội ngũ FireTech E&C
---
Ở nhiều kho hàng, cửa thoát nạn thường được khóa hoặc đóng kín để bảo đảm an ninh và giữ nhiệt độ bảo quản. Câu hỏi đặt ra là khi có cháy, cửa có mở kịp để người bên trong thoát ra hay không. Trong một dự án kho hàng hóa gia dụng, đội ngũ FireTech E&C đã đưa trực tiếp logic điều khiển cửa vào mô hình FDS để trả lời câu hỏi này.

## Mô phỏng logic điều khiển, không chỉ mô phỏng khói

- Hệ thống đầu báo khói được bố trí đúng theo bản vẽ thiết kế; FDS ghi lại thời điểm từng đầu báo kích hoạt khi mật độ khói vượt ngưỡng.
- Cửa thoát nạn được gắn với tín hiệu báo khói thông qua các khối điều khiển trong FDS (điều kiện "hoặc" giữa các đầu báo, kèm một khoảng trễ). Khi điều kiện thỏa mãn, cửa chuyển sang trạng thái mở và khói bắt đầu thoát ra ngoài.
- Quá trình thoát nạn của người lao động được mô phỏng bằng Pathfinder với đặc tính riêng: nhân viên đã được đào tạo về an toàn cháy nổ, thông thuộc lối thoát nạn và luôn ở trạng thái tỉnh táo.

## Kết quả quan sát

- Đầu báo khói gần đám cháy nhất kích hoạt sau khoảng nửa phút; các đầu báo ở xa kích hoạt dần theo sự lan truyền của lớp khói, có đầu báo không kích hoạt trong suốt thời gian mô phỏng.
- Cửa thoát nạn chuyển sang trạng thái mở chỉ vài giây sau đó, theo đúng khoảng trễ đã lập trình.
- Chỉ số liều lượng khí độc tích lũy (FED) tại lối thoát chỉ bắt đầu tăng sau khoảng 5 phút và khi kết thúc mô phỏng vẫn thấp hơn khoảng một trăm lần so với ngưỡng an toàn 0,3.

## Bài học rút ra

- Với những công trình phụ thuộc vào thiết bị tự động như cửa tự mở, quạt hút khói hay cửa ngăn cháy, cần mô phỏng cả logic điều khiển của thiết bị, không chỉ đặt cửa ở trạng thái mở sẵn.
- Thời điểm đầu báo kích hoạt quyết định toàn bộ chuỗi phản ứng phía sau; vị trí và mật độ đầu báo vì thế cần được rà soát cùng với kịch bản cháy.
- Đội ngũ nhân viên được huấn luyện tốt, thông thuộc lối thoát nạn giúp rút ngắn đáng kể thời gian chuẩn bị di tản.
