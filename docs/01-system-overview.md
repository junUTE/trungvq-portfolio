# System Overview

## 1. Mục tiêu sản phẩm

Đây là một dự án portfolio full-stack phục vụ 3 mục đích chính:

- Giới thiệu bản thân, kỹ năng và dự án với nhà tuyển dụng.
- Tạo kênh liên hệ trực tiếp thông qua form gửi tin nhắn.
- Cho phép bạn tự quản trị nội dung dự án và tin nhắn từ một trang admin riêng.

## 2. Kiến trúc tổng thể

Hệ thống sử dụng mô hình client-server tách biệt:

- `Frontend`: React + Tailwind CSS
- `Backend`: Node.js + Express
- `Database`: MongoDB Atlas
- `Authentication`: JWT hoặc `httpOnly cookie`
- `Email Service`: Nodemailer
- `Deployment`: Vercel hoặc Netlify cho frontend, Render hoặc Railway cho backend

## 3. Luồng hoạt động chính

### Public Flow

1. Người dùng truy cập website portfolio.
2. Frontend gọi API để lấy danh sách dự án từ backend.
3. Backend truy vấn MongoDB và trả dữ liệu JSON.
4. Frontend render danh sách dự án, kỹ năng và các trang giới thiệu.
5. Khi người dùng gửi form liên hệ:
6. Frontend gửi dữ liệu lên API backend.
7. Backend validate dữ liệu, lưu vào `Contacts`.
8. Backend gửi email thông báo về Gmail cá nhân của bạn.
9. Frontend hiển thị trạng thái gửi thành công hoặc thất bại.

### Admin Flow

1. Bạn truy cập trang `admin-login`.
2. Nhập tài khoản admin.
3. Backend kiểm tra thông tin đăng nhập.
4. Nếu hợp lệ, backend cấp token hoặc thiết lập session an toàn.
5. Admin dashboard gọi các API riêng để:
6. Thêm, sửa, xóa project.
7. Xem danh sách tin nhắn liên hệ.
8. Đánh dấu tin nhắn đã phản hồi.

## 4. Phạm vi MVP nên triển khai

Để tối ưu thời gian và chất lượng, phiên bản đầu tiên chỉ nên tập trung vào:

- Trang chủ giới thiệu bản thân.
- Trang kỹ năng.
- Trang danh sách dự án.
- Trang chi tiết dự án.
- Contact form có lưu database và gửi email.
- Admin login.
- CRUD project trong admin.
- Danh sách contact và cập nhật trạng thái phản hồi.

## 5. Những điểm tạo giá trị với nhà tuyển dụng

- Có dữ liệu động thay vì hard-code toàn bộ.
- Có khu vực quản trị nội dung.
- Có xử lý gửi mail thực tế.
- Có mô hình deploy tách frontend/backend.
- Có yếu tố bảo mật cơ bản và quy trình tổ chức dự án rõ ràng.

## 6. Định hướng kỹ thuật nên ưu tiên

- Ưu tiên tính ổn định trước khi thêm nhiều tính năng.
- Viết API rõ ràng, dễ test.
- Thiết kế schema có thể mở rộng nhưng không quá phức tạp.
- Tối ưu UX của trang public vì đây là phần nhà tuyển dụng nhìn thấy đầu tiên.
- Admin dashboard nên gọn, thực dụng, dễ dùng hơn là quá cầu kỳ.
