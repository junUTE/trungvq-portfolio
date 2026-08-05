# TrungVQ Portfolio

Portfolio full-stack theo roadmap 7 ngày với `frontend` React/Vite và `backend` Express/MongoDB. Repo hiện đã được đẩy tới mốc Day 7 cơ bản: public portfolio lấy dữ liệu từ API, admin dashboard có auth + CRUD project/contact, contact form có gửi mail, và luồng upload ảnh đã sẵn sàng để nối Cloudinary khi deploy.

## Cấu trúc

```text
.
├── backend
│   └── src
├── docs
├── frontend
│   └── src
├── 01-system-overview.md
├── 02-technical-spec.md
├── 03-roadmap-7-days.md
└── .env.example
```

## Tính năng hiện có

- Public portfolio lấy project từ backend và có trang chi tiết theo `slug`
- Contact form lưu MongoDB, validate dữ liệu, rate limit và gửi email thông báo bằng Nodemailer
- Admin login bằng JWT bearer token
- Admin dashboard CRUD project, quản lý contact và cập nhật avatar
- Upload ảnh project/avatar lên Cloudinary qua backend, đồng thời tự dọn asset cũ khi thay hoặc xóa project
- CORS cấu hình theo biến môi trường để tách domain frontend/backend khi deploy

## Cách chạy local

1. Cài dependencies ở root:

```bash
npm install
```

2. Tạo file `.env` từ `.env.example` và điền:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- `EMAIL_USER`, `EMAIL_PASS`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

3. Chạy frontend:

```bash
npm run dev:frontend
```

4. Chạy backend:

```bash
npm run dev:backend
```

Frontend mặc định chạy ở `http://localhost:5173` và backend ở `http://localhost:5000`.

## Deploy checklist

- Frontend: đặt `VITE_API_URL=https://your-backend-domain/api`
- Backend: đặt `FRONTEND_URL` hoặc `CORS_ALLOWED_ORIGINS` trỏ đúng domain frontend production
- Gmail: dùng `App Password`, không dùng mật khẩu tài khoản chính
- Cloudinary: kiểm tra upload project/avatar trả về `url` và `publicId`
- Test production flow:
  - Public project list và project detail tải được
  - Contact form gửi thành công và nhận email thông báo
  - Admin login chặn đúng khi chưa có token
  - Upload ảnh mới và xóa project không để lại asset rác

## Tài liệu tham chiếu

- [01-system-overview.md](./01-system-overview.md)
- [02-technical-spec.md](./02-technical-spec.md)
- [03-roadmap-7-days.md](./03-roadmap-7-days.md)
