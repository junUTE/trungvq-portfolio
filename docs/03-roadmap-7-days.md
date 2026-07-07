# 7-Day Roadmap

## Mục tiêu chung

Sau 7 ngày, bạn cần có một portfolio full-stack chạy được, deploy được và có thể gửi cho nhà tuyển dụng:

- Trang public hoàn chỉnh
- API backend ổn định
- Database kết nối thành công
- Contact form lưu dữ liệu và gửi mail
- Admin dashboard CRUD project và quản lý contact

## Day 1: Lập nền tảng dự án

### Mục tiêu

- Tạo cấu trúc frontend và backend
- Chuẩn bị môi trường phát triển
- Xác định thiết kế UI sơ bộ và danh sách nội dung thật

### Việc cần làm

- Tạo repo hoặc 2 thư mục `frontend` và `backend`
- Khởi tạo React app
- Cài Tailwind CSS
- Khởi tạo Express server
- Cài các package cơ bản cho backend
- Tạo file `.env.example`
- Kết nối GitHub repository
- Phác thảo sitemap:
  - Home
  - About
  - Skills
  - Projects
  - Contact
  - Admin Login
  - Admin Dashboard

### Kết quả cuối ngày

- Frontend chạy local
- Backend chạy local
- Có cấu trúc thư mục rõ ràng
- Có danh sách nội dung bạn sẽ đưa lên portfolio

## Day 2: Xây giao diện public

### Mục tiêu

- Hoàn thiện phần giao diện người xem

### Việc cần làm

- Thiết kế Hero section
- Làm About section
- Làm Skills section
- Làm layout cho Projects page
- Làm Contact form UI
- Tạo navbar và footer
- Responsive cho mobile và tablet

### Kết quả cuối ngày

- Portfolio public có giao diện hoàn chỉnh ở mức tĩnh
- Có thể click điều hướng giữa các section hoặc page

## Day 3: Thiết kế database và API public

### Mục tiêu

- Hoàn thiện backend phần dữ liệu public

### Việc cần làm

- Tạo MongoDB Atlas cluster
- Cấu hình kết nối Mongoose
- Tạo `ProjectModel`, `ContactModel`, `UserModel`
- Seed 2 đến 4 project mẫu
- Viết API:
  - `GET /api/projects`
  - `GET /api/projects/:slug`
  - `POST /api/contacts`
- Chuẩn bị schema ảnh:
  - `image`
  - `imagePublicId`
  - `avatar`
  - `avatarPublicId`
- Validate dữ liệu đầu vào
- Test API bằng Postman hoặc Thunder Client

### Kết quả cuối ngày

- Backend đọc và ghi dữ liệu MongoDB thành công
- Frontend có thể bắt đầu lấy project thật từ API

## Day 4: Kết nối frontend với backend

### Mục tiêu

- Biến giao diện tĩnh thành sản phẩm hoạt động thật

### Việc cần làm

- Tạo service gọi API
- Render danh sách project từ backend
- Tạo filter theo công nghệ
- Làm trang chi tiết project bằng `slug`
- Kết nối Contact form với API
- Hiển thị trạng thái:
  - đang gửi
  - gửi thành công
  - gửi thất bại

### Kết quả cuối ngày

- Người dùng có thể xem project thật
- Contact form gửi được dữ liệu xuống server

## Day 5: Xây admin authentication và dashboard cơ bản

### Mục tiêu

- Tạo khu vực quản trị riêng

### Việc cần làm

- Tạo admin user seed ban đầu
- Viết API login
- Hash mật khẩu bằng `bcrypt`
- Tạo JWT hoặc auth bằng `httpOnly cookie`
- Viết middleware bảo vệ route admin
- Chuẩn bị API upload avatar nếu muốn cập nhật profile admin
- Tạo giao diện `admin-login`
- Tạo dashboard layout cơ bản

### Kết quả cuối ngày

- Admin đăng nhập được
- Admin dashboard chỉ truy cập được sau khi xác thực

## Day 6: CRUD project và quản lý contact

### Mục tiêu

- Hoàn thiện chức năng quản trị cốt lõi

### Việc cần làm

- Viết API thêm project
- Viết API sửa project
- Viết API xóa project
- Viết API upload ảnh project lên cloud
- Tạo form admin để thêm và sửa project
- Tạo bảng danh sách project
- Tạo trang danh sách contact
- Tạo nút đánh dấu `đã phản hồi`

### API nên hoàn thành trong ngày 6

- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`
- `GET /api/admin/contacts`
- `PATCH /api/admin/contacts/:id`
- `POST /api/admin/upload/project-image`
- `POST /api/admin/upload/avatar`

### Kết quả cuối ngày

- Bạn có thể quản trị nội dung mà không sửa code tay
- Contact messages được theo dõi trong dashboard

## Day 7: Gửi mail, tối ưu, deploy

### Mục tiêu

- Hoàn thiện sản phẩm để public

### Việc cần làm

- Tích hợp Nodemailer
- Tích hợp cloud storage, ví dụ Cloudinary
- Gửi email khi có contact mới
- Thêm rate limit cho contact form
- Kiểm tra CORS và biến môi trường
- Deploy backend lên Render hoặc Railway
- Deploy frontend lên Vercel hoặc Netlify
- Kết nối domain API giữa frontend và backend
- Test end-to-end trên bản production
- Sửa lỗi UI/UX nhỏ
- Viết README dự án trên GitHub

### Checklist API trước khi deploy

- Public API trả dữ liệu đúng format
- Admin API bị chặn nếu chưa đăng nhập
- Upload API trả về `url` và `publicId`
- Xóa hoặc thay ảnh không để file rác trên cloud
- Contact API có validate và rate limit

### Kết quả cuối ngày

- Portfolio online hoạt động được
- Có link demo để gửi nhà tuyển dụng
- Có tài liệu dự án và roadmap rõ ràng

## Checklist hoàn thiện trước khi gửi nhà tuyển dụng

- Có ít nhất 3 project thật
- Có ảnh preview đẹp cho từng project
- Có link GitHub và link demo rõ ràng
- Contact form hoạt động thật
- Giao diện không vỡ trên mobile
- Không lộ thông tin nhạy cảm trong source code
- README mô tả stack và tính năng
- Tốc độ tải trang chấp nhận được

## Gợi ý phân bổ thời gian mỗi ngày

- `2 giờ` cho phần kỹ thuật nền
- `2 đến 3 giờ` cho UI hoặc tính năng chính
- `1 giờ` cho test và sửa lỗi
- `30 phút` để commit, ghi chú, cập nhật TODO

## Mẹo để không bị quá tải

- Không mở rộng sang blog ngay trong tuần đầu.
- Không làm admin dashboard quá đẹp, chỉ cần sạch và dễ dùng.
- Ưu tiên hoàn thiện luồng chính trước:
  - xem dự án
  - gửi contact
  - admin đăng nhập
  - CRUD project
- Nếu thiếu thời gian, giữ contact management đơn giản nhưng phải chạy ổn định.
