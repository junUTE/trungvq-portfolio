import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";
import {
  createContact,
  extractErrorMessage,
  getCurrentAdmin,
  getStoredAuthToken,
  getProjectBySlug,
  getProjects,
  loginAdmin,
  logoutAdmin,
  setAuthToken
} from "./services/portfolioApi";

const codeRepos = [
  {
    owner: "trungvq",
    name: "portfolio-cms-starter",
    summary: "Starter monorepo cho portfolio full-stack với React, Express và MongoDB.",
    tags: [
      { label: "React", color: "bg-sky-500" },
      { label: "Node.js", color: "bg-emerald-500" },
      { label: "MongoDB", color: "bg-green-600" }
    ]
  },
  {
    owner: "trungvq",
    name: "dashboard-ui-kit",
    summary: "Bộ component cho dashboard nội bộ với focus vào readability và responsive layout.",
    tags: [
      { label: "Tailwind", color: "bg-cyan-500" },
      { label: "UI", color: "bg-violet-500" }
    ]
  },
  {
    owner: "trungvq",
    name: "contact-automation-api",
    summary: "API xử lý contact form, trạng thái phản hồi và luồng gửi email cho admin.",
    tags: [
      { label: "Express", color: "bg-slate-600" },
      { label: "JWT", color: "bg-amber-500" }
    ]
  }
];

const articles = [
  {
    title: "Cách mình tổ chức một portfolio full-stack trong 7 ngày",
    category: "Career",
    date: "07 July 2026",
    readTime: "4 minute read",
    excerpt:
      "Một kế hoạch thực dụng để hoàn thiện portfolio có frontend, backend, database, auth và deploy mà không bị lan man.",
    tone: "from-slate-200 to-slate-100"
  },
  {
    title: "Những gì nhà tuyển dụng thực sự muốn thấy ở một project cá nhân",
    category: "Frontend",
    date: "05 July 2026",
    readTime: "5 minute read",
    excerpt:
      "Thay vì nhồi quá nhiều hiệu ứng, mình tập trung vào cấu trúc, nội dung thật, tốc độ tải và trải nghiệm người dùng rõ ràng.",
    tone: "from-sky-200 to-cyan-100"
  }
];

function App() {
  const location = useLocation();
  const adminSession = useAdminSession();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const headerAdminLink = adminSession.user
    ? { to: "/admin", label: "Dashboard" }
    : { to: "/admin-login", label: "Admin" };

  if (isAdminRoute) {
    return (
      <Routes>
        <Route
          path="/admin-login"
          element={
            <AdminLoginPage
              isAuthenticated={adminSession.isAuthenticated}
              authLoading={adminSession.loading}
              onLoginSuccess={adminSession.handleLoginSuccess}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute isAuthenticated={adminSession.isAuthenticated} loading={adminSession.loading}>
              <AdminDashboardPage user={adminSession.user} onLogout={adminSession.logout} />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <div className="px-4 py-8 sm:px-8 sm:pb-10 sm:pt-14 xl:pt-20">
        <Header adminLink={headerAdminLink} />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route
              path="/work"
              element={
                <ListPage
                  title="Work"
                  description="Trang work sẽ gom các case study, kinh nghiệm và vai trò nổi bật của bạn."
                  items={[
                    "Lead frontend implementation",
                    "Internal dashboard systems",
                    "Client-facing product delivery"
                  ]}
                />
              }
            />
            <Route
              path="/articles"
              element={
                <ListPage
                  title="Articles"
                  description="Trang articles sẽ chứa bài viết kỹ thuật và chia sẻ quá trình học tập, xây dựng sản phẩm."
                  items={articles.map((item) => item.title)}
                />
              }
            />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin-login" element={<Navigate to="/admin-login" replace />} />
            <Route path="/admin" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function ProtectedAdminRoute({ isAuthenticated, loading, children }) {
  if (loading) {
    return <AdminStatusScreen title="Checking session" message="Đang kiểm tra trạng thái đăng nhập admin..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

function AdminLoginPage({ isAuthenticated, authLoading, onLoginSuccess }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const payload = await loginAdmin(credentials);
      onLoginSuccess(payload.data);
      setStatus("success");
      setFeedback(payload.message || "Đăng nhập thành công.");
      navigate("/admin", { replace: true });
    } catch (error) {
      setStatus("error");
      setFeedback(extractErrorMessage(error));
    } finally {
      setStatus("idle");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setCredentials((current) => ({
      ...current,
      [name]: value
    }));
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_45%),linear-gradient(180deg,_#f8fafc,_#e2e8f0)] px-4 py-10 text-slate-800 sm:px-8 sm:py-16">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2rem] border border-white/70 bg-slate-900 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.24)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Admin Access</p>
          <h1 className="mt-6 text-4xl font-light sm:text-5xl">Portfolio control room</h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Khu vực này dành cho quản trị nội dung dự án, theo dõi contact và mở rộng CRUD trong ngày 6.
          </p>
          <div className="mt-10 grid gap-4">
            {["JWT bearer authentication", "Protected admin route middleware", "Ready for project CRUD and contact management"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Sign In</p>
              <h2 className="mt-3 text-3xl font-light text-slate-900">Admin login</h2>
            </div>
            <Link to="/" className="text-sm font-medium uppercase tracking-[0.18em] text-sky-600">
              Back home
            </Link>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
            {feedback || "Dùng tài khoản admin đã được seed từ biến môi trường `ADMIN_USERNAME` và `ADMIN_PASSWORD`."}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Username</span>
              <input
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-sky-400"
                placeholder="admin"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-sky-400"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-medium uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Signing in..." : "Login to dashboard"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function AdminDashboardPage({ user, onLogout }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogout() {
    setStatus("submitting");
    setError("");

    try {
      await onLogout();
      navigate("/admin-login", { replace: true });
    } catch (logoutError) {
      setError(extractErrorMessage(logoutError));
    } finally {
      setStatus("idle");
    }
  }

  const metrics = [
    { label: "Authentication", value: "JWT active", helper: "Bearer token + server guard" },
    { label: "Role", value: user?.role || "admin", helper: "Admin-only access" },
    {
      label: "Last login",
      value: formatAdminDate(user?.lastLogin),
      helper: "Updated after successful login"
    }
  ];

  const nextSteps = [
    "Kết nối CRUD project vào dashboard trong ngày 6.",
    "Thêm trang contact management và trạng thái replied.",
    "Chuẩn bị avatar upload API khi cần cập nhật hồ sơ admin."
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8 sm:py-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(12,74,110,0.95))] p-8 shadow-[0_30px_80px_rgba(2,6,23,0.45)] sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Admin Dashboard</p>
              <h1 className="mt-4 text-4xl font-light text-white sm:text-5xl">Xin chào, {user?.username}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                Dashboard cơ bản đã sẵn sàng và chỉ hiển thị sau khi xác thực thành công từ backend.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-100"
              >
                View public site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={status === "submitting"}
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>

          {error ? <InfoCard className="mt-6" tone="error" message={error} /> : null}

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
                <p className="mt-4 text-2xl font-light text-white">{metric.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{metric.helper}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Access summary</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <AdminPanelCard title="Protected backend">
                `GET /api/auth/me` yêu cầu token hợp lệ và middleware kiểm tra role admin.
              </AdminPanelCard>
              <AdminPanelCard title="Seeded credentials">
                Admin account được tạo từ script seed với mật khẩu đã hash bằng `bcrypt`.
              </AdminPanelCard>
              <AdminPanelCard title="Frontend session">
                Token được lưu local và được nạp lại khi bạn mở dashboard lần sau.
              </AdminPanelCard>
              <AdminPanelCard title="Ready for Day 6">
                Layout này có thể gắn project table, contact table và form CRUD ngay sau bước auth.
              </AdminPanelCard>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-800">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Next build items</p>
            <div className="mt-6 space-y-4">
              {nextSteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-medium text-white">
                    0{index + 1}
                  </div>
                  <p className="pt-2 text-base leading-7 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function AdminPanelCard({ title, children }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-lg font-medium text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{children}</p>
    </article>
  );
}

function AdminStatusScreen({ title, message }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-slate-100">
        <p className="text-sm uppercase tracking-[0.28em] text-sky-300">{title}</p>
        <p className="mt-4 text-lg leading-8 text-slate-300">{message}</p>
      </div>
    </div>
  );
}

function HomePage() {
  const { projects, loading, error } = useProjects();
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);

  return (
    <div className="space-y-10 sm:space-y-14 xl:space-y-20">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:rounded-3xl sm:p-14">
        <div className="space-y-5">
          <h1 className="text-3xl font-light tracking-tight text-slate-800 sm:text-5xl">Frontend & Full-stack Developer</h1>
          <p className="text-xl leading-relaxed text-slate-700 sm:text-2xl">
            Mình xây dựng web app với <Highlight tone="text-sky-600">React</Highlight>,{" "}
            <Highlight tone="text-cyan-600">Tailwind CSS</Highlight>, <Highlight tone="text-emerald-600">Node.js</Highlight>,{" "}
            <Highlight tone="text-violet-600">Express</Highlight> và đang phát triển portfolio theo hướng có admin quản trị nội dung thật.
          </p>
          <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
            Mục tiêu của mình là tạo ra giao diện chỉn chu, hiệu năng tốt và đủ chiều sâu kỹ thuật để gây ấn tượng với nhà tuyển dụng.
          </p>
          <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
            Bạn có thể tìm mình trên <a className="font-normal text-sky-600 hover:opacity-60" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a> và{" "}
            <a className="font-normal text-sky-600 hover:opacity-60" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>.
          </p>
        </div>
      </section>

      <SectionShell title="Code">
        <div className="grid grid-cols-1 gap-4 md:gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {codeRepos.map((repo) => (
            <article
              key={repo.name}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:scale-[1.03] hover:opacity-80"
            >
              <div className="p-4">
                <div className="flex gap-2">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700">
                    GH
                  </div>

                  <p className="self-center break-words text-sm font-medium text-slate-800">
                    {repo.owner}
                    <span className="font-normal text-slate-400"> / </span>
                    {repo.name}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">{repo.summary}</p>

                <p className="mt-3 inline-flex items-center text-sm text-sky-600">
                  View Repo
                  <ArrowIcon className="ml-1 h-4 w-4" />
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 px-5 py-3.5">
                {repo.tags.map((tag) => (
                  <p key={tag.label} className="flex items-center gap-1.5 text-xs leading-none">
                    <span className={`inline-block h-3 w-3 rounded-full ${tag.color}`}></span>
                    {tag.label}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell title="Projects">
        {loading ? <InfoCard message="Đang tải project từ backend..." /> : null}
        {error ? <InfoCard tone="error" message={error} /> : null}
        {!loading && !error ? (
          <div className="grid grid-cols-1 gap-10 sm:gap-5 md:gap-7 lg:grid-cols-2">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => <ProjectShowcaseCard key={project._id || project.slug} project={project} />)
            ) : (
              <InfoCard message="Chưa có project nổi bật nào được publish." />
            )}
          </div>
        ) : null}
      </SectionShell>

      <SectionShell title="Articles">
        <div className="space-y-6 sm:space-y-8">
          {articles.map((article) => (
            <article
              key={article.title}
              className="flex gap-7 rounded-xl border border-slate-200 bg-white p-5 shadow-lg max-sm:flex-col sm:gap-10 sm:rounded-2xl sm:p-10"
            >
              <div className={`rounded-xl bg-gradient-to-br ${article.tone} p-4 shadow-lg sm:w-[240px] sm:shrink-0`}>
                <div className="flex h-full min-h-[190px] items-end rounded-xl border border-white/60 bg-white/55 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-sky-600">{article.category}</p>
                    <p className="mt-2 text-2xl font-light leading-tight text-slate-800">Notes</p>
                  </div>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="mb-4 text-2xl font-light text-slate-800 sm:mb-5 sm:text-3xl">{article.title}</h3>

                <p className="mb-4 flex flex-wrap items-center gap-3 text-sm leading-tight text-slate-500 sm:mb-5 sm:gap-5 sm:text-lg">
                  <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-700">
                    {article.category}
                  </span>
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </p>

                <p className="mb-4 text-base leading-7 text-slate-600 sm:mb-5 sm:text-lg">{article.excerpt}</p>

                <a href="/" className="inline-flex items-center gap-1 text-base text-sky-600 transition-opacity duration-300 hover:opacity-50 sm:text-lg">
                  Read Article
                  <ArrowIcon className="h-5 w-5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}

function ProjectsPage() {
  const { projects, loading, error } = useProjects();
  const [activeTech, setActiveTech] = useState("All");

  const technologies = ["All", ...new Set(projects.flatMap((project) => project.technologies || []))];
  const filteredProjects =
    activeTech === "All" ? projects : projects.filter((project) => (project.technologies || []).includes(activeTech));

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-light text-slate-800">Projects</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Dữ liệu được lấy trực tiếp từ backend, có filter theo công nghệ và route chi tiết bằng slug.
          </p>
        </div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{projects.length} published projects</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {technologies.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => setActiveTech(tech)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTech === tech
                ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {loading ? <InfoCard className="mt-8" message="Đang tải danh sách project..." /> : null}
      {error ? <InfoCard className="mt-8" tone="error" message={error} /> : null}
      {!loading && !error ? (
        filteredProjects.length > 0 ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectGridCard key={project._id || project.slug} project={project} />
            ))}
          </div>
        ) : (
          <InfoCard className="mt-8" message="Không có project nào khớp với công nghệ đang chọn." />
        )
      ) : null}
    </section>
  );
}

function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProject() {
      setLoading(true);
      setError("");

      try {
        const payload = await getProjectBySlug(slug);

        if (active) {
          setProject(payload.data);
        }
      } catch (requestError) {
        if (active) {
          setProject(null);
          setError(extractErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      {loading ? <InfoCard className="m-6" message="Đang tải chi tiết project..." /> : null}
      {error ? <InfoCard className="m-6" tone="error" message={error} /> : null}
      {!loading && !error && project ? (
        <>
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-10">
              <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-sky-600">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to projects
              </Link>

              <h1 className="mt-6 text-4xl font-light text-slate-800 sm:text-5xl">{project.title}</h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">{project.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {(project.technologies || []).map((tech) => (
                  <span key={tech} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <LinkCard href={project.demoLink} label="Live Demo" />
                <LinkCard href={project.githubLink} label="GitHub Repository" />
              </div>
            </div>

            <div className="border-t border-slate-200 bg-gradient-to-br from-sky-100 via-white to-cyan-50 p-6 lg:border-l lg:border-t-0 sm:p-10">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="h-64 w-full object-cover" />
                ) : (
                  <div className="flex h-64 items-center justify-center bg-slate-100 text-sm uppercase tracking-[0.24em] text-slate-400">
                    No preview image
                  </div>
                )}
                <div className="space-y-3 p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-600">Project Snapshot</p>
                  <p className="text-lg font-medium text-slate-800">{project.summary}</p>
                  <p className="text-sm leading-6 text-slate-600">
                    {project.featured ? "Đây là một project nổi bật trên trang public." : "Project này đang xuất hiện trong danh sách published."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 py-8 sm:px-10">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Implementation Notes</p>
              <p className="mt-4 text-lg leading-8 text-slate-600">{project.content}</p>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

function ContactPage() {
  const initialForm = { name: "", email: "", message: "" };
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const payload = await createContact(formData);
      setStatus("success");
      setFeedback(payload.message || "Tin nhắn đã được gửi thành công.");
      setFormData(initialForm);
    } catch (error) {
      setStatus("error");
      setFeedback(extractErrorMessage(error));
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="text-4xl font-light text-slate-800">Contact</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Form này đã được nối trực tiếp tới `POST /api/contacts`, lưu dữ liệu xuống server và phản hồi lại trạng thái theo thời gian thực.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Submission status</p>
            <p className="mt-3 text-lg text-slate-700">
              {status === "idle" ? "Sẵn sàng nhận tin nhắn mới." : null}
              {status === "submitting" ? "Đang gửi dữ liệu tới backend..." : null}
              {status === "success" ? feedback : null}
              {status === "error" ? feedback : null}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400"
            placeholder="Tên của bạn"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400"
            placeholder="Email"
          />
          <textarea
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            required
            minLength="10"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400"
            placeholder="Nội dung liên hệ"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-fit rounded-full bg-sky-600 px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

function SectionShell({ title, children }) {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-3xl font-light text-slate-800 sm:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ListPage({ title, description, items }) {
  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <h1 className="text-4xl font-light text-slate-800">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-lg text-slate-700">{item}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectShowcaseCard({ project }) {
  return (
    <article className="min-w-0">
      <Link to={`/projects/${project.slug}`} className="block transition-opacity duration-300 hover:opacity-60">
        <div className="ml-[-1px] w-[calc(100%+2px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="relative flex w-full items-center gap-3 border-b border-slate-200 bg-gray-50 px-[58px] py-3">
            <div className="absolute left-4 top-1/2 flex -translate-y-1/2 gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
            </div>

            <div className="flex-1 truncate text-center font-mono text-xs text-slate-400">{project.slug}.case-study</div>
          </div>

          <div className="aspect-video w-full bg-gradient-to-br from-sky-100 via-white to-cyan-50 p-6">
            {project.image ? (
              <img src={project.image} alt={project.title} className="h-full w-full rounded-2xl border border-slate-200/80 object-cover shadow-lg" />
            ) : (
              <div className="flex h-full items-end rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-lg backdrop-blur">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-sky-600">Product Preview</p>
                  <h3 className="mt-3 text-2xl font-light text-slate-800">{project.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">{project.summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="mb-2.5 mt-5 sm:mb-4 sm:mt-8">
        <h3 className="text-2xl font-light text-slate-800 sm:text-3xl">{project.title}</h3>
      </div>

      <p className="mb-4 text-base leading-7 text-slate-600 sm:mb-6 sm:text-lg">{project.description}</p>

      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 sm:gap-x-5 sm:text-base">
        {(project.technologies || []).slice(0, 3).map((tech) => (
          <li key={tech} className="flex items-center gap-1.5">
            <CheckIcon className="h-5 w-5" />
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ProjectGridCard({ project }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
      <div className="aspect-video bg-gradient-to-br from-sky-100 via-white to-cyan-50">
        {project.image ? <img src={project.image} alt={project.title} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-light text-slate-800">{project.title}</h2>
          {project.featured ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-700">
              Featured
            </span>
          ) : null}
        </div>

        <p className="text-base leading-7 text-slate-600">{project.summary}</p>

        <div className="flex flex-wrap gap-2">
          {(project.technologies || []).map((tech) => (
            <span key={tech} className="rounded-full bg-white px-3 py-1 text-sm text-slate-500 ring-1 ring-slate-200">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white">
            View Details
            <ArrowIcon className="h-4 w-4" />
          </Link>
          <ExternalLink href={project.demoLink} label="Demo" />
          <ExternalLink href={project.githubLink} label="GitHub" />
        </div>
      </div>
    </article>
  );
}

function LinkCard({ href, label }) {
  if (!href) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-400">
        {label} chưa được cập nhật.
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600"
    >
      {label}
    </a>
  );
}

function ExternalLink({ href, label }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition hover:text-sky-600"
    >
      {label}
    </a>
  );
}

function InfoCard({ message, tone = "default", className = "" }) {
  const palette =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-slate-200 bg-slate-50 text-slate-600";

  return <div className={`rounded-2xl border p-5 text-base ${palette} ${className}`.trim()}>{message}</div>;
}

function Highlight({ children, tone }) {
  return <span className={`font-normal ${tone}`}>{children}</span>;
}

function ArrowIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      setLoading(true);
      setError("");

      try {
        const payload = await getProjects();

        if (active) {
          setProjects(payload.data || []);
        }
      } catch (requestError) {
        if (active) {
          setProjects([]);
          setError(extractErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  return {
    projects,
    loading,
    error
  };
}

function useAdminSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getStoredAuthToken()));

  useEffect(() => {
    const storedToken = getStoredAuthToken();

    if (!storedToken) {
      setLoading(false);
      return;
    }

    let active = true;

    async function hydrateSession() {
      try {
        const payload = await getCurrentAdmin();

        if (active) {
          setUser(payload.data.user);
        }
      } catch {
        setAuthToken("");

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    hydrateSession();

    return () => {
      active = false;
    };
  }, []);

  function handleLoginSuccess(data) {
    setAuthToken(data.token);
    setUser(data.user);
    setLoading(false);
  }

  async function handleLogout() {
    try {
      await logoutAdmin();
    } finally {
      setAuthToken("");
      setUser(null);
    }
  }

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    handleLoginSuccess,
    logout: handleLogout
  };
}

function formatAdminDate(value) {
  if (!value) {
    return "Just seeded";
  }

  return new Date(value).toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export default App;
