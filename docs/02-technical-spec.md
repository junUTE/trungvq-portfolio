# Technical Specification

## 1. Cấu trúc thư mục đề xuất

Nếu tách 2 phần riêng trong cùng một repository:

```text
portfolio/
  frontend/
    src/
      components/
      pages/
      sections/
      services/
      hooks/
      utils/
      assets/
    public/
  backend/
    src/
      config/
      controllers/
      models/
      routes/
      middlewares/
      services/
      utils/
    uploads/
```

Nếu bạn muốn chuyên nghiệp hơn khi trình bày GitHub, có thể dùng 2 repository:

- `portfolio-frontend`
- `portfolio-backend`

## 2. Công nghệ đề xuất

### Frontend

- React
- React Router
- Tailwind CSS
- Axios hoặc Fetch API
- React Hook Form nếu muốn form sạch và dễ validate

### Backend

- Node.js
- Express.js
- Mongoose
- bcrypt
- jsonwebtoken
- Nodemailer
- express-rate-limit
- cors
- dotenv

## 3. Database schema đề xuất

### Projects

```js
{
  title: String,
  slug: String,
  summary: String,
  description: String,
  content: String,
  technologies: [String],
  githubLink: String,
  demoLink: String,
  image: String,
  imagePublicId: String,
  featured: Boolean,
  status: String, // draft | published
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

Gợi ý:

- `slug` để tạo URL đẹp như `/projects/ecommerce-website`
- `featured` để chọn dự án nổi bật
- `status` để ẩn project chưa muốn public
- `order` để sắp xếp thủ công
- `imagePublicId` hỗ trợ cập nhật hoặc xóa ảnh trên cloud

### Contacts

```js
{
  name: String,
  email: String,
  message: String,
  status: String, // unread | replied
  isRead: Boolean,
  repliedAt: Date,
  createdAt: Date
}
```

Gợi ý:

- `isRead` giúp filter nhanh
- `repliedAt` hữu ích khi theo dõi xử lý

### Users

```js
{
  username: String,
  passwordHash: String,
  avatar: String,
  avatarPublicId: String,
  role: String, // admin
  lastLogin: Date,
  createdAt: Date
}
```

Gợi ý:

- `avatar` lưu URL ảnh đại diện của admin hoặc user profile nếu sau này mở rộng.
- `avatarPublicId` hỗ trợ thay avatar hoặc xóa file cũ trên cloud.
- Không lưu file ảnh trực tiếp trong database, chỉ lưu đường dẫn ảnh.

## 4. API endpoints đề xuất

### Public APIs

- `GET /api/projects`
- `GET /api/projects/:slug`
- `POST /api/contacts`

### Auth APIs

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Admin APIs

- `GET /api/admin/projects`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`
- `GET /api/admin/contacts`
- `PATCH /api/admin/contacts/:id`

### Media APIs

- `POST /api/admin/upload/project-image`
- `POST /api/admin/upload/avatar`
- `DELETE /api/admin/upload`

Gợi ý triển khai:

- Upload ảnh lên cloud trước, nhận về `url` và `publicId`
- Sau đó mới gửi dữ liệu project hoặc user profile về MongoDB
- Khi thay ảnh cũ, backend có thể dùng `publicId` để xóa file cũ trên cloud

## 5. Quy tắc validate nên có

### Project

- `title`: bắt buộc, tối thiểu 3 ký tự
- `summary`: bắt buộc, ngắn gọn
- `technologies`: phải là mảng
- `githubLink` và `demoLink`: phải là URL hợp lệ nếu có

### Contact

- `name`: bắt buộc
- `email`: đúng định dạng email
- `message`: tối thiểu 10 ký tự

### Auth

- `username`: bắt buộc
- `password`: bắt buộc

### Media Upload

- Chỉ cho phép `jpg`, `jpeg`, `png`, `webp`
- Giới hạn dung lượng file, ví dụ `2MB` đến `5MB`
- Kiểm tra MIME type ở backend
- Chuẩn hóa kích thước ảnh nếu cần ở phía cloud service

## 6. Bảo mật cơ bản nên có

- Hash password bằng `bcrypt`
- Không commit file `.env`
- Giới hạn số lần gửi contact form bằng `rate limit`
- Chỉ cho admin gọi API quản trị
- Kiểm tra input ở cả frontend và backend
- Dùng `helmet` nếu muốn tăng bảo mật HTTP headers
- Ưu tiên `httpOnly cookie` nếu bạn muốn auth an toàn hơn localStorage

## 7. Biến môi trường cần chuẩn bị

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password_seed
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=https://your-frontend-domain.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Lưu ý:

- Với Gmail nên dùng `App Password`, không dùng mật khẩu Gmail chính.
- Nếu deploy frontend và backend tách nhau, `FRONTEND_URL` cần đúng domain để cấu hình CORS.
- Thông tin cloud storage cũng phải để trong biến môi trường, không hard-code trong source code.

## 8. Tính năng frontend nên có

- Hero section nổi bật, rõ định hướng nghề nghiệp
- Khu vực giới thiệu bản thân ngắn gọn
- Skills section với nhóm kỹ năng rõ ràng
- Project list có filter theo công nghệ
- Trang project detail
- Contact form với thông báo trạng thái gửi
- Loading state và error state rõ ràng
- Responsive tốt trên mobile

## 9. Tính năng admin nên có

- Login page riêng
- Dashboard tổng quan đơn giản
- Form thêm và sửa project
- Danh sách project với nút sửa/xóa
- Danh sách contact
- Nút đánh dấu đã phản hồi

## 10. Deploy strategy

### Frontend

- Deploy bằng Vercel hoặc Netlify
- Build từ branch chính
- Trỏ biến môi trường `VITE_API_URL` hoặc tương đương tới backend

### Backend

- Deploy bằng Render hoặc Railway
- Kết nối MongoDB Atlas
- Thiết lập đầy đủ biến môi trường

### Database

- MongoDB Atlas Free Tier là đủ cho portfolio

### Media Storage

- Nên dùng dịch vụ bên thứ ba để lưu ảnh như Cloudinary.
- Database chỉ lưu URL ảnh của `project image`, `thumbnail`, `avatar`.
- Cách này nhẹ hơn, dễ deploy hơn và không phải tự xử lý lưu file trên server.
- Với portfolio cá nhân, Cloudinary là lựa chọn khá hợp lý vì dễ tích hợp, có free tier và CDN sẵn.

## 11. Chiến lược quản lý ảnh đề xuất

### Loại dữ liệu nên lưu ở cloud

- Ảnh preview dự án
- Ảnh chi tiết dự án nếu sau này có gallery
- Ảnh avatar admin
- Ảnh CV preview hoặc asset media khác nếu cần

### Dữ liệu nên lưu trong MongoDB

- URL ảnh
- `publicId` của ảnh nếu dùng Cloudinary và muốn hỗ trợ xóa hoặc thay thế ảnh

Ví dụ:

```js
{
  image: "https://res.cloudinary.com/your-cloud/image/upload/project-demo.jpg",
  imagePublicId: "portfolio/projects/project-demo"
}
```

Ví dụ với user:

```js
{
  avatar: "https://res.cloudinary.com/your-cloud/image/upload/admin-avatar.jpg",
  avatarPublicId: "portfolio/avatars/admin-avatar"
}
```

### Vì sao không nên lưu ảnh trực tiếp trong server backend

- Server free tier thường không phù hợp để lưu file lâu dài.
- Khi redeploy, file local có thể mất.
- Tăng độ phức tạp khi backup, scale và tối ưu hiệu năng.
- Không có CDN sẵn như các dịch vụ media chuyên dụng.

## 12. Những gì nên để sau MVP

- Blog management
- Upload ảnh trực tiếp lên cloud
- Analytics dashboard
- Search nâng cao
- Đa ngôn ngữ
- Markdown editor cho project content
