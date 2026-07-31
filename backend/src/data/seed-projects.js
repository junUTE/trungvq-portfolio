const seedProjects = [
  {
    title: "Portfolio CMS",
    slug: "portfolio-cms",
    summary: "A portfolio platform with an admin dashboard to manage projects and contacts.",
    description: "Full-stack portfolio for showcasing work with private content management tools.",
    content:
      "Built with React, Express, and MongoDB. Includes public project pages, a contact workflow, and admin-ready data structures.",
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
    title: "E-Commerce Admin",
    slug: "ecommerce-admin",
    summary: "A dashboard focused on catalog management, orders, and reporting.",
    description: "Responsive admin experience for small online shops.",
    content:
      "Implements product management, order state tracking, and clean reporting widgets with a REST API backend.",
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
    title: "Learning Tracker",
    slug: "learning-tracker",
    summary: "A personal dashboard for tracking study goals and weekly progress.",
    description: "An app for organizing learning plans and progress updates.",
    content:
      "Supports categorized goals, streak tracking, and simple analytics for personal growth workflows.",
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
