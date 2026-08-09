import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminDashboard from "./components/AdminDashboard";
import {
  createContact,
  extractErrorMessage,
  getArticles,
  getCurrentAdmin,
  getProfile,
  getStoredAuthToken,
  getProjectBySlug,
  getProjects,
  getWorkItems,
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

const uiText = {
  homeSocialLead: {
    vi: "Bạn có thể tìm mình trên ",
    en: "You can find me on "
  },
  and: {
    vi: "và ",
    en: "and "
  },
  code: {
    vi: "Code",
    en: "Code"
  },
  projects: {
    vi: "Dự án",
    en: "Projects"
  },
  articles: {
    vi: "Bài viết",
    en: "Articles"
  },
  work: {
    vi: "Kinh nghiệm",
    en: "Work"
  },
  contact: {
    vi: "Liên hệ",
    en: "Contact"
  },
  viewRepo: {
    vi: "Xem repo",
    en: "View Repo"
  },
  homeProjectsLoading: {
    vi: "Đang tải dự án từ backend...",
    en: "Loading projects from the backend..."
  },
  homeProjectsEmpty: {
    vi: "Chưa có dự án nổi bật nào được publish.",
    en: "No featured projects have been published yet."
  },
  homeArticlesLoading: {
    vi: "Đang tải bài viết...",
    en: "Loading articles..."
  },
  homeArticlesEmpty: {
    vi: "Chưa có bài viết nào được publish.",
    en: "No published articles yet."
  },
  workIntro: {
    vi: "Trang này tổng hợp các kinh nghiệm và case study ngắn được lấy trực tiếp từ backend.",
    en: "This page pulls experience highlights and short case studies directly from the backend."
  },
  workLoading: {
    vi: "Đang tải work highlights...",
    en: "Loading work highlights..."
  },
  workEmpty: {
    vi: "Chưa có work item nào được publish.",
    en: "No published work items yet."
  },
  articlesIntro: {
    vi: "Trang này hiển thị bài viết kỹ thuật và chia sẻ học tập từ dữ liệu thật trong database.",
    en: "This page shows technical writing and learning notes from real database content."
  },
  articlesLoading: {
    vi: "Đang tải bài viết...",
    en: "Loading articles..."
  },
  articlesEmpty: {
    vi: "Chưa có bài viết nào được publish.",
    en: "No published articles yet."
  },
  projectsIntro: {
    vi: "Một số sản phẩm và trải nghiệm mình đã xây dựng, từ ý tưởng đến giao diện và phần triển khai thực tế.",
    en: "A selection of products and experiments I have built, from concept through interface and implementation."
  },
  projectsLoading: {
    vi: "Đang tải danh sách dự án...",
    en: "Loading project list..."
  },
  projectsEmpty: {
    vi: "Chưa có dự án nào được publish.",
    en: "No published projects yet."
  },
  backToProjects: {
    vi: "Quay lại dự án",
    en: "Back to projects"
  },
  visitSite: {
    vi: "Xem website",
    en: "Visit Site"
  },
  githubRepository: {
    vi: "Kho GitHub",
    en: "GitHub Repository"
  },
  quickSnapshot: {
    vi: "Tóm tắt nhanh",
    en: "Quick Snapshot"
  },
  featuredProjectNote: {
    vi: "Đây là dự án nổi bật đang được ưu tiên hiển thị trên trang public.",
    en: "This is a featured project currently prioritised on the public site."
  },
  publishedProjectNote: {
    vi: "Dự án này đang được xuất bản trong danh sách project public.",
    en: "This project is currently published in the public projects listing."
  },
  overview: {
    vi: "Tổng quan",
    en: "Overview"
  },
  whatThisProjectDoes: {
    vi: "Dự án này làm gì",
    en: "What this project does"
  },
  techStack: {
    vi: "Công nghệ",
    en: "Tech Stack"
  },
  builtWith: {
    vi: "Xây dựng với",
    en: "Built With"
  },
  links: {
    vi: "Liên kết",
    en: "Links"
  },
  sourceCode: {
    vi: "Mã nguồn",
    en: "Source Code"
  },
  buildNotes: {
    vi: "Ghi chú xây dựng",
    en: "Build Notes"
  },
  howItWasPutTogether: {
    vi: "Dự án được triển khai như thế nào",
    en: "How it was put together"
  },
  nextStep: {
    vi: "Bước tiếp theo",
    en: "Next Step"
  },
  exploreLiveProject: {
    vi: "Khám phá dự án thực tế",
    en: "Explore the live project"
  },
  exploreLiveProjectText: {
    vi: "Nếu bạn muốn xem kỹ hơn trải nghiệm thật, mình đã để sẵn link demo và source code ngay bên dưới.",
    en: "If you want to explore the real product in more detail, the live demo and source code are linked below."
  },
  openDemo: {
    vi: "Mở demo",
    en: "Open Demo"
  },
  viewRepository: {
    vi: "Xem repository",
    en: "View Repository"
  },
  projectPreview: {
    vi: "Xem trước dự án",
    en: "Project Preview"
  },
  viewDetails: {
    vi: "Xem chi tiết",
    en: "View Details"
  },
  visibleProjects: {
    vi: "dự án hiển thị",
    en: "visible projects"
  },
  noLinkYet: {
    vi: "chưa được cập nhật.",
    en: "is not available yet."
  },
  contactTitle: {
    vi: "Liên hệ",
    en: "Contact Me"
  },
  contactIntro: {
    vi: "Nếu bạn muốn trao đổi về một dự án hoặc chỉ đơn giản là kết nối, hãy điền form bên dưới. Mình sẽ cố gắng phản hồi trong vòng 2 ngày.",
    en: "If you'd like to chat about a project or simply connect, please fill out the form below. I aim to reply within 2 days."
  },
  sendingMessage: {
    vi: "Đang gửi...",
    en: "Sending..."
  },
  sendMessage: {
    vi: "Gửi tin nhắn",
    en: "Send Message"
  },
  contactSuccess: {
    vi: "Tin nhắn đã được gửi thành công.",
    en: "Your message has been sent successfully."
  },
  name: {
    vi: "Họ tên",
    en: "Name"
  },
  message: {
    vi: "Tin nhắn",
    en: "Message"
  },
  notes: {
    vi: "Ghi chú",
    en: "Notes"
  },
  featured: {
    vi: "Nổi bật",
    en: "Featured"
  },
  publishedProjectsCountSuffix: {
    vi: "dự án đã đăng",
    en: "published projects"
  }
};

function App() {
  const location = useLocation();
  const adminSession = useAdminSession();
  const publicProfileState = useProfile();
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") {
      return "vi";
    }

    return window.localStorage.getItem("portfolio-language") || "vi";
  });
  const isAdminRoute = location.pathname.startsWith("/admin");
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("portfolio-language", language);
    document.documentElement.lang = language;
  }, [language]);

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
              <AdminDashboard
                user={adminSession.user}
                onLogout={adminSession.logout}
                onUserChange={adminSession.setUser}
                onPublicProfileChange={publicProfileState.setProfile}
              />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-700">
      <div className="px-4 py-8 sm:px-8 sm:pb-10 sm:pt-14 xl:pt-20">
        <Header profile={publicProfileState.profile} language={language} onLanguageChange={setLanguage} />

        <main>
          <Routes>
            <Route path="/" element={<HomePage profileState={publicProfileState} language={language} />} />
            <Route path="/projects" element={<ProjectsPage language={language} />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage language={language} />} />
            <Route path="/work" element={<WorkPage language={language} />} />
            <Route path="/articles" element={<ArticlesPage language={language} />} />
            <Route path="/contact" element={<ContactPage language={language} />} />
            <Route path="/admin-login" element={<Navigate to="/admin-login" replace />} />
            <Route path="/admin" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>

        <Footer language={language} />
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
  const [showPassword, setShowPassword] = useState(false);

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
      <section className="mx-auto max-w-2xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">Sign In</p>
              <h2 className="mt-3 text-3xl font-medium text-slate-900">Admin login</h2>
            </div>
            <Link to="/" className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
              Back home
            </Link>
          </div>

          {feedback ? (
            <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
              {feedback}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Username</span>
              <input
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition focus:border-sky-400"
                placeholder="admin"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3.5 focus-within:border-sky-400">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-slate-900 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="shrink-0 text-sm font-semibold text-slate-500 transition hover:text-sky-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Signing in..." : "Login to dashboard"}
            </button>
          </form>
        </div>
      </section>
    </div>
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

function HomePage({ profileState, language }) {
  const { projects, loading, error } = useProjects();
  const {
    profile,
    loading: loadingProfile,
    error: profileError
  } = profileState || useProfile();
  const { articles, loading: loadingArticles, error: articlesError } = useArticles();
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);
  const featuredArticles = articles.slice(0, 2);

  return (
    <div className="space-y-10 sm:space-y-14 xl:space-y-20">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:rounded-3xl sm:p-14">
        {loadingProfile ? <InfoCard message={language === "en" ? "Loading profile..." : "Đang tải profile..."} /> : null}
        {profileError ? <InfoCard tone="error" message={profileError} /> : null}
        {!loadingProfile && !profileError && profile ? (
          <div className="space-y-5">
            <h1 className="text-3xl font-light tracking-tight text-slate-800 sm:text-5xl">
              {getLocalizedValue(profile.heroTitle, language)}
            </h1>
            <p className="hero-intro-text text-xl leading-relaxed text-slate-700 sm:text-2xl">
              {(profile.introSegments || []).map((segment, index) => (
                <Highlight key={`${getLocalizedValue(segment.text, language)}-${index}`} tone={segment.tone}>
                  {getLocalizedValue(segment.text, language)}
                </Highlight>
              ))}
            </p>
            <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
              {getLocalizedValue(profile.goalDescription, language)}
            </p>
            <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
              {getLocalizedValue(uiText.homeSocialLead, language)}
              <a className="font-normal text-sky-600 hover:opacity-60" href={profile.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>{" "}
              {getLocalizedValue(uiText.and, language)}
              <a className="font-normal text-sky-600 hover:opacity-60" href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              .
            </p>
          </div>
        ) : null}
      </section>

      <SectionShell title={getLocalizedValue(uiText.code, language)}>
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
                  {getLocalizedValue(uiText.viewRepo, language)}
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

      <SectionShell title={getLocalizedValue(uiText.projects, language)}>
        {loading ? <InfoCard message={getLocalizedValue(uiText.homeProjectsLoading, language)} /> : null}
        {error ? <InfoCard tone="error" message={error} /> : null}
        {!loading && !error ? (
          <div className="grid grid-cols-1 gap-10 sm:gap-5 md:gap-7 lg:grid-cols-2">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <ProjectShowcaseCard key={project._id || project.slug} project={project} language={language} />
              ))
            ) : (
              <InfoCard message={getLocalizedValue(uiText.homeProjectsEmpty, language)} />
            )}
          </div>
        ) : null}
      </SectionShell>

      <SectionShell title={getLocalizedValue(uiText.articles, language)}>
        {loadingArticles ? <InfoCard message={getLocalizedValue(uiText.homeArticlesLoading, language)} /> : null}
        {articlesError ? <InfoCard tone="error" message={articlesError} /> : null}
        {!loadingArticles && !articlesError ? (
          featuredArticles.length > 0 ? (
            <div className="space-y-6 sm:space-y-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article._id || article.slug} article={article} language={language} />
              ))}
            </div>
          ) : (
            <InfoCard message={getLocalizedValue(uiText.homeArticlesEmpty, language)} />
          )
        ) : null}
      </SectionShell>
    </div>
  );
}

function WorkPage({ language }) {
  const { workItems, loading, error } = useWorkItems();

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <h1 className="text-4xl font-semibold text-slate-800">{getLocalizedValue(uiText.work, language)}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        {getLocalizedValue(uiText.workIntro, language)}
      </p>

      {loading ? <InfoCard className="mt-8" message={getLocalizedValue(uiText.workLoading, language)} /> : null}
      {error ? <InfoCard className="mt-8" tone="error" message={error} /> : null}
      {!loading && !error ? (
        workItems.length > 0 ? (
          <div className="mt-8 grid gap-4">
            {workItems.map((item) => (
              <article key={item._id} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-light text-slate-800">{item.title}</h2>
                    <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">
                      {[item.company, item.period].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <StatusPill value={item.status} />
                </div>
                <p className="mt-4 text-base leading-7 text-slate-600">{item.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(item.highlights || []).map((highlight) => (
                    <span key={highlight} className="rounded-full bg-white px-3 py-1 text-sm text-slate-500 ring-1 ring-slate-200">
                      {highlight}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <InfoCard className="mt-8" message={getLocalizedValue(uiText.workEmpty, language)} />
        )
      ) : null}
    </section>
  );
}

function ArticlesPage({ language }) {
  const { articles, loading, error } = useArticles();

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <h1 className="text-4xl font-semibold text-slate-800">{getLocalizedValue(uiText.articles, language)}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        {getLocalizedValue(uiText.articlesIntro, language)}
      </p>

      {loading ? <InfoCard className="mt-8" message={getLocalizedValue(uiText.articlesLoading, language)} /> : null}
      {error ? <InfoCard className="mt-8" tone="error" message={error} /> : null}
      {!loading && !error ? (
        articles.length > 0 ? (
          <div className="mt-8 space-y-6 sm:space-y-8">
            {articles.map((article) => (
              <ArticleCard key={article._id || article.slug} article={article} language={language} />
            ))}
          </div>
        ) : (
          <InfoCard className="mt-8" message={getLocalizedValue(uiText.articlesEmpty, language)} />
        )
      ) : null}
    </section>
  );
}

function ProjectsPage({ language }) {
  const { projects, loading, error } = useProjects();

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mx-auto mb-14 max-w-5xl xl:mb-20">
        <h1 className="font-['Be_Vietnam_Pro'] text-4xl font-medium text-slate-900 sm:text-5xl">{getLocalizedValue(uiText.projects, language)}</h1>
        <p className="mt-5 max-w-3xl text-xl leading-relaxed text-slate-700 sm:text-2xl">
          {getLocalizedValue(uiText.projectsIntro, language)}
        </p>
      </div>

      {loading ? <InfoCard className="mx-auto mt-8 max-w-5xl" message={getLocalizedValue(uiText.projectsLoading, language)} /> : null}
      {error ? <InfoCard className="mx-auto mt-8 max-w-5xl" tone="error" message={error} /> : null}
      {!loading && !error ? (
        projects.length > 0 ? (
          <div className="mx-auto mt-14 max-w-7xl space-y-14 xl:mt-20 xl:space-y-20">
            {projects.map((project, index) => (
              <ProjectListingCard
                key={project._id || project.slug}
                project={project}
                reverse={index % 2 === 1}
                language={language}
              />
            ))}
          </div>
        ) : (
          <InfoCard className="mx-auto mt-8 max-w-5xl" message={getLocalizedValue(uiText.projectsEmpty, language)} />
        )
      ) : null}
    </section>
  );
}

function ProjectDetailPage({ language }) {
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
    <section className="mx-auto max-w-5xl">
      {loading ? <InfoCard className="mb-6" message={language === "en" ? "Loading project details..." : "Đang tải chi tiết dự án..."} /> : null}
      {error ? <InfoCard className="mb-6" tone="error" message={error} /> : null}
      {!loading && !error && project ? (
        <div className="space-y-10 sm:space-y-14">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-start">
              <div>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-sky-600 transition hover:opacity-70"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  {getLocalizedValue(uiText.backToProjects, language)}
                </Link>

                <h1 className="mt-6 font-['Be_Vietnam_Pro'] text-4xl font-medium leading-tight text-slate-900 sm:text-5xl">
                  {project.title}
                </h1>
                <p className="mt-5 max-w-3xl text-xl leading-relaxed text-slate-700">{project.summary}</p>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{project.description}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {(project.technologies || []).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 bg-sky-50/80 px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <LinkCard href={project.demoLink} label={getLocalizedValue(uiText.visitSite, language)} language={language} />
                  <LinkCard href={project.githubLink} label={getLocalizedValue(uiText.githubRepository, language)} language={language} />
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0px_8px_24px_rgba(0,0,0,0.05)] sm:p-5">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                  <div className="relative flex w-full items-center gap-3 border-b border-slate-200 bg-gray-50 px-[58px] py-3">
                    <div className="absolute left-4 top-1/2 flex -translate-y-1/2 gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                    </div>

                    <div className="flex-1 truncate text-center font-mono text-xs text-slate-400">
                      {project.slug || "preview"}.case-study
                    </div>
                  </div>

                  <div className="aspect-video w-full bg-gradient-to-br from-sky-100 via-white to-cyan-50 p-4 sm:p-6">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full rounded-2xl border border-slate-200/80 object-cover object-top shadow-lg"
                      />
                    ) : (
                      <div className="flex h-full items-end rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-lg backdrop-blur">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-sky-600">{getLocalizedValue(uiText.projectPreview, language)}</p>
                          <h2 className="mt-3 text-2xl font-medium text-slate-800">{project.title}</h2>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{project.summary}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{getLocalizedValue(uiText.quickSnapshot, language)}</p>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {project.featured
                      ? getLocalizedValue(uiText.featuredProjectNote, language)
                      : getLocalizedValue(uiText.publishedProjectNote, language)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-5">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:col-span-3 sm:p-10">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-600">{getLocalizedValue(uiText.overview, language)}</p>
              <h2 className="mt-4 font-['Be_Vietnam_Pro'] text-3xl font-medium leading-tight text-slate-900 sm:text-4xl">
                {getLocalizedValue(uiText.whatThisProjectDoes, language)}
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
                {splitParagraphs(project.description).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:col-span-2 sm:p-10">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-600">{getLocalizedValue(uiText.techStack, language)}</p>
              <h2 className="mt-4 font-['Be_Vietnam_Pro'] text-3xl font-medium leading-tight text-slate-900">{getLocalizedValue(uiText.builtWith, language)}</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {(project.technologies || []).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-3 rounded-2xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{getLocalizedValue(uiText.links, language)}</p>
                <ExternalLink href={project.demoLink} label={getLocalizedValue(uiText.visitSite, language)} />
                <ExternalLink href={project.githubLink} label={getLocalizedValue(uiText.sourceCode, language)} />
              </div>
            </aside>
          </div>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-600">{getLocalizedValue(uiText.buildNotes, language)}</p>
            <h2 className="mt-4 font-['Be_Vietnam_Pro'] text-3xl font-medium leading-tight text-slate-900 sm:text-4xl">
              {getLocalizedValue(uiText.howItWasPutTogether, language)}
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {splitParagraphs(project.content).map((paragraph, index) => (
                <div key={`${index}-${paragraph.slice(0, 24)}`} className="rounded-2xl bg-slate-50 p-5 sm:p-6">
                  <p className="text-base leading-8 text-slate-600">{paragraph}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-sky-600">{getLocalizedValue(uiText.nextStep, language)}</p>
                <h2 className="mt-4 font-['Be_Vietnam_Pro'] text-3xl font-medium leading-tight text-slate-900 sm:text-4xl">
                  {getLocalizedValue(uiText.exploreLiveProject, language)}
                </h2>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                  {getLocalizedValue(uiText.exploreLiveProjectText, language)}
                </p>
              </div>

              <div className="grid w-full gap-4 sm:w-auto sm:grid-cols-2">
                <LinkCard href={project.demoLink} label={getLocalizedValue(uiText.openDemo, language)} language={language} />
                <LinkCard href={project.githubLink} label={getLocalizedValue(uiText.viewRepository, language)} language={language} />
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function ContactPage({ language }) {
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
      setFeedback(payload.message || getLocalizedValue(uiText.contactSuccess, language));
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
    <section className="mx-auto max-w-5xl">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-sky-600">
          {language === "en" ? "Let's Talk" : "Cùng Trao Đổi"}
        </p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight text-slate-900 sm:text-6xl">{getLocalizedValue(uiText.contactTitle, language)}</h1>
        <p className="mt-6 text-lg leading-9 text-slate-600 sm:text-2xl">
          {getLocalizedValue(uiText.contactIntro, language)}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-12 grid max-w-4xl gap-6 rounded-[2rem] border border-white/60 bg-white/55 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 md:p-10"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="grid gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {getLocalizedValue(uiText.name, language)} <span className="text-rose-500">*</span>
            </span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 text-lg text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              placeholder={language === "en" ? "Your name" : "Tên của bạn"}
            />
          </label>

          <label className="grid gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Email <span className="text-rose-500">*</span>
            </span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 text-lg text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              placeholder={language === "en" ? "name@example.com" : "tenban@example.com"}
            />
          </label>
        </div>

        <label className="grid gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {getLocalizedValue(uiText.message, language)} <span className="text-rose-500">*</span>
          </span>
          <textarea
            name="message"
            rows="7"
            value={formData.message}
            onChange={handleChange}
            required
            minLength="10"
            className="min-h-[240px] rounded-2xl border border-white/70 bg-white/80 px-5 py-4 text-lg text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            placeholder={
              language === "en"
                ? "Share a project idea, collaboration plan, or anything you'd like to discuss..."
                : "Chia sẻ ý tưởng dự án, kế hoạch hợp tác, hoặc bất kỳ điều gì bạn muốn trao đổi..."
            }
          />
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-slate-500">
            {language === "en"
              ? "I usually reply within 2 days."
              : "Mình thường phản hồi trong vòng 2 ngày."}
          </p>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
          >
            {status === "submitting" ? getLocalizedValue(uiText.sendingMessage, language) : getLocalizedValue(uiText.sendMessage, language)}
          </button>
        </div>
      </form>
    </section>
  );
}

function SectionShell({ title, children }) {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-3xl font-semibold text-slate-800 sm:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ListPage({ title, description, items }) {
  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <h1 className="text-4xl font-semibold text-slate-800">{title}</h1>
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

function ArticleCard({ article, language = "vi" }) {
  return (
    <article className="flex gap-7 rounded-xl border border-slate-200 bg-white p-5 shadow-lg max-sm:flex-col sm:gap-10 sm:rounded-2xl sm:p-10">
      <div className={`rounded-xl bg-gradient-to-br ${article.tone || "from-slate-200 to-slate-100"} p-4 shadow-lg sm:w-[240px] sm:shrink-0`}>
        <div className="flex h-full min-h-[190px] items-end rounded-xl border border-white/60 bg-white/55 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-600">{article.category}</p>
            <p className="mt-2 text-2xl font-light leading-tight text-slate-800">{getLocalizedValue(uiText.notes, language)}</p>
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="mb-4 text-2xl font-light text-slate-800 sm:mb-5 sm:text-3xl">{article.title}</h3>

        <p className="mb-4 flex flex-wrap items-center gap-3 text-sm leading-tight text-slate-500 sm:mb-5 sm:gap-5 sm:text-lg">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-700">
            {article.category}
          </span>
          <span>{formatDisplayDate(article.publishedAt)}</span>
          <span>{article.readTime}</span>
        </p>

        <p className="mb-4 text-base leading-7 text-slate-600 sm:mb-5 sm:text-lg">{article.excerpt}</p>
      </div>
    </article>
  );
}

function ProjectShowcaseCard({ project, language = "vi" }) {
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
                  <p className="text-xs uppercase tracking-[0.22em] text-sky-600">{getLocalizedValue(uiText.projectPreview, language)}</p>
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

function ProjectListingCard({ project, reverse = false, language = "vi" }) {
  return (
    <article className={`flex flex-col items-center gap-8 md:gap-14 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}>
      <div className="w-full md:w-[58.75%] md:shrink-0">
        <Link to={`/projects/${project.slug}`} className="block transition-opacity duration-300 hover:opacity-50">
          <div className="ml-[-1px] w-[calc(100%+2px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="relative flex w-full items-center gap-3 border-b border-slate-200 bg-gray-50 px-[58px] py-3">
              <div className="absolute left-4 top-1/2 flex -translate-y-1/2 gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
              </div>

              <div className="flex-1 truncate text-center font-mono text-xs text-slate-400">
                {project.demoLink ? formatProjectDomain(project.demoLink) : `${project.slug}.case-study`}
              </div>
            </div>

            <div className="block w-full h-auto bg-white">
              {project.image ? (
                <img src={project.image} alt={project.title} className="block h-auto w-full object-cover object-top" />
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-sky-100 via-white to-cyan-50 p-6">
                  <div className="flex h-full items-end rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-lg backdrop-blur">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-sky-600">{getLocalizedValue(uiText.projectPreview, language)}</p>
                      <h3 className="mt-3 text-2xl font-medium text-slate-800">{project.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{project.summary}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      <div className="w-full">
        <div className="mb-2.5 sm:mb-4">
          <h2 className="font-['Be_Vietnam_Pro'] text-3xl font-medium text-slate-900 md:text-4xl">
            <Link to={`/projects/${project.slug}`} className="transition-opacity duration-300 hover:opacity-50">
              {project.title}
            </Link>
          </h2>
        </div>

        <p className="mb-4 text-lg leading-8 text-slate-600 sm:mb-6 sm:text-xl">{project.summary}</p>

        <ul className="flex flex-col gap-1.5 text-slate-500 sm:gap-2 sm:text-xl">
          {(project.technologies || []).slice(0, 5).map((tech) => (
            <li key={tech} className="flex items-center gap-1.5">
              <CheckIcon className="h-5 w-5" />
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-6 sm:mt-8">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white transition hover:opacity-85"
          >
            {getLocalizedValue(uiText.viewDetails, language)}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
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

function LinkCard({ href, label, language = "vi" }) {
  if (!href) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-400">
        {label} {getLocalizedValue(uiText.noLinkYet, language)}
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
  return <span className={tone}>{children}</span>;
}

function StatusPill({ value }) {
  return (
    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-700">
      {value}
    </span>
  );
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

function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const payload = await getProfile();

        if (active) {
          setProfile(payload.data);
        }
      } catch (requestError) {
        if (active) {
          setProfile(null);
          setError(extractErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  return {
    profile,
    loading,
    error,
    setProfile
  };
}

function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadArticles() {
      setLoading(true);
      setError("");

      try {
        const payload = await getArticles();

        if (active) {
          setArticles(payload.data || []);
        }
      } catch (requestError) {
        if (active) {
          setArticles([]);
          setError(extractErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      active = false;
    };
  }, []);

  return {
    articles,
    loading,
    error
  };
}

function useWorkItems() {
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadWorkItems() {
      setLoading(true);
      setError("");

      try {
        const payload = await getWorkItems();

        if (active) {
          setWorkItems(payload.data || []);
        }
      } catch (requestError) {
        if (active) {
          setWorkItems([]);
          setError(extractErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadWorkItems();

    return () => {
      active = false;
    };
  }, []);

  return {
    workItems,
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
    logout: handleLogout,
    setUser
  };
}

function splitParagraphs(value) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(/\r?\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatProjectDomain(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    return url.host.replace(/^www\./, "www.");
  } catch {
    return value;
  }
}

function formatDisplayDate(value) {
  if (!value) {
    return "Unscheduled";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function getLocalizedValue(value, language) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    return value[language] || value.vi || value.en || "";
  }

  return String(value);
}

export default App;
