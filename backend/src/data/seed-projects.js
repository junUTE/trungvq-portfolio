const seedProjects = [
  {
    title: { vi: "Portfolio CMS", en: "Portfolio CMS" },
    slug: "portfolio-cms",
    summary: {
      vi: "Nền tảng portfolio có dashboard admin để quản lý dự án và liên hệ.",
      en: "A portfolio platform with an admin dashboard to manage projects and contacts."
    },
    description: {
      vi: "Portfolio full-stack để trưng bày sản phẩm kèm bộ công cụ quản trị nội dung riêng.",
      en: "Full-stack portfolio for showcasing work with private content management tools."
    },
    content: {
      vi: "Được xây dựng với React, Express và MongoDB. Bao gồm trang dự án public, luồng liên hệ và cấu trúc dữ liệu sẵn sàng cho admin.",
      en: "Built with React, Express, and MongoDB. Includes public project pages, a contact workflow, and admin-ready data structures."
    },
    technologies: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    githubLink: "https://github.com/example/portfolio-cms",
    demoLink: "https://portfolio-cms.example.com",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    imagePublicId: "portfolio/projects/portfolio-cms",
    featured: true,
    status: "published",
    order: 1
  },
  {
    title: { vi: "E-Commerce Admin", en: "E-Commerce Admin" },
    slug: "ecommerce-admin",
    summary: {
      vi: "Dashboard tập trung vào quản lý danh mục, đơn hàng và báo cáo.",
      en: "A dashboard focused on catalog management, orders, and reporting."
    },
    description: {
      vi: "Trải nghiệm quản trị responsive cho các cửa hàng online quy mô nhỏ.",
      en: "Responsive admin experience for small online shops."
    },
    content: {
      vi: "Triển khai quản lý sản phẩm, theo dõi trạng thái đơn hàng và các widget báo cáo gọn gàng trên nền REST API.",
      en: "Implements product management, order state tracking, and clean reporting widgets with a REST API backend."
    },
    technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
    githubLink: "https://github.com/example/ecommerce-admin",
    demoLink: "https://ecommerce-admin.example.com",
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
    imagePublicId: "portfolio/projects/ecommerce-admin",
    featured: true,
    status: "published",
    order: 2
  },
  {
    title: { vi: "Learning Tracker", en: "Learning Tracker" },
    slug: "learning-tracker",
    summary: {
      vi: "Dashboard cá nhân để theo dõi mục tiêu học tập và tiến độ hằng tuần.",
      en: "A personal dashboard for tracking study goals and weekly progress."
    },
    description: {
      vi: "Ứng dụng để tổ chức kế hoạch học tập và cập nhật tiến độ.",
      en: "An app for organizing learning plans and progress updates."
    },
    content: {
      vi: "Hỗ trợ mục tiêu theo danh mục, theo dõi streak và thống kê đơn giản cho quy trình phát triển cá nhân.",
      en: "Supports categorized goals, streak tracking, and simple analytics for personal growth workflows."
    },
    technologies: ["React", "Express", "MongoDB", "Chart.js"],
    githubLink: "https://github.com/example/learning-tracker",
    demoLink: "https://learning-tracker.example.com",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    imagePublicId: "portfolio/projects/learning-tracker",
    featured: false,
    status: "published",
    order: 3
  }
];

export default seedProjects;
