const seedArticles = [
  {
    title: {
      vi: "Cách mình tổ chức một portfolio full-stack trong 7 ngày",
      en: "How I structure a full-stack portfolio in 7 days"
    },
    slug: "portfolio-full-stack-trong-7-ngay",
    category: { vi: "Sự nghiệp", en: "Career" },
    readTime: { vi: "Đọc trong 4 phút", en: "4 minute read" },
    excerpt: {
      vi: "Một kế hoạch thực dụng để hoàn thiện portfolio có frontend, backend, database, auth và deploy mà không bị lan man.",
      en: "A practical plan to finish a portfolio with frontend, backend, database, auth, and deployment without getting scattered."
    },
    tone: "from-slate-200 to-slate-100",
    publishedAt: new Date("2026-07-07"),
    status: "published",
    order: 1
  },
  {
    title: {
      vi: "Những gì nhà tuyển dụng thực sự muốn thấy ở một project cá nhân",
      en: "What recruiters actually want to see in a personal project"
    },
    slug: "nha-tuyen-dung-muon-thay-o-project-ca-nhan",
    category: { vi: "Frontend", en: "Frontend" },
    readTime: { vi: "Đọc trong 5 phút", en: "5 minute read" },
    excerpt: {
      vi: "Thay vì nhồi quá nhiều hiệu ứng, mình tập trung vào cấu trúc, nội dung thật, tốc độ tải và trải nghiệm người dùng rõ ràng.",
      en: "Instead of stuffing in too many effects, I focus on structure, real content, loading speed, and clear user experience."
    },
    tone: "from-sky-200 to-cyan-100",
    publishedAt: new Date("2026-07-05"),
    status: "published",
    order: 2
  }
];

export default seedArticles;
