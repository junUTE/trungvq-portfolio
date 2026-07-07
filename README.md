# TrungVQ Portfolio

Nền tảng ngày 1 cho portfolio full-stack theo roadmap 7 ngày. Repository này đã được dựng sẵn theo mô hình monorepo gồm `frontend` và `backend` để bạn tiếp tục phát triển UI, API, database và admin dashboard trong các ngày tiếp theo.

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

## Những gì đã có sau ngày 1

- `frontend`: React + Vite + Tailwind skeleton với sitemap public và admin placeholder
- `backend`: Express server có sẵn route `GET /api/health`
- `.env.example`: biến môi trường mẫu cho frontend, backend, auth, mail và media
- `docs/day-1-sitemap.md`: sitemap để bám khi mở rộng UI
- `docs/day-1-content-plan.md`: checklist nội dung thật cần chuẩn bị cho portfolio

## Cách chạy local

1. Cài dependencies ở root:

```bash
npm install
```

2. Chạy frontend:

```bash
npm run dev:frontend
```

3. Chạy backend:

```bash
npm run dev:backend
```

Frontend mặc định chạy ở `http://localhost:5173` và backend ở `http://localhost:5000`.

## Tài liệu tham chiếu

- [01-system-overview.md](./01-system-overview.md)
- [02-technical-spec.md](./02-technical-spec.md)
- [03-roadmap-7-days.md](./03-roadmap-7-days.md)
