import { Route, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";

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

const featuredProjects = [
  {
    title: "Recruiter Portfolio CMS",
    url: "portfolio.trungvq.dev",
    description:
      "Website portfolio có giao diện public hiện đại, trang chi tiết dự án, contact form và khu vực admin quản trị nội dung.",
    highlights: ["Portfolio", "Admin CRUD", "Responsive UI"],
    tone: "from-sky-100 via-white to-cyan-50"
  },
  {
    title: "Operations Dashboard",
    url: "ops.trungvq.dev",
    description:
      "Dashboard theo dõi chỉ số vận hành và luồng xử lý công việc với bố cục card-based rõ ràng, ưu tiên tốc độ đọc dữ liệu.",
    highlights: ["Analytics", "Charts", "Role-based UX"],
    tone: "from-amber-100 via-white to-rose-50"
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
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <div className="px-4 py-8 sm:px-8 sm:pb-10 sm:pt-14 xl:pt-20">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ListPage title="Projects" description="Danh sách dự án sẽ được tách thành trang riêng ở bước tiếp theo." items={featuredProjects.map((item) => item.title)} />} />
            <Route path="/work" element={<ListPage title="Work" description="Trang work sẽ gom các case study, kinh nghiệm và vai trò nổi bật của bạn." items={["Lead frontend implementation", "Internal dashboard systems", "Client-facing product delivery"]} />} />
            <Route path="/articles" element={<ListPage title="Articles" description="Trang articles sẽ chứa bài viết kỹ thuật và chia sẻ quá trình học tập, xây dựng sản phẩm." items={articles.map((item) => item.title)} />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-14 xl:space-y-20">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:rounded-3xl sm:p-14">
        <div className="space-y-5">
          <h1 className="text-3xl font-light tracking-tight text-slate-800 sm:text-5xl">👨‍💻 Frontend & Full-stack Developer</h1>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-7">
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
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 sm:gap-5 md:gap-7">
          {featuredProjects.map((project) => (
            <article key={project.title} className="min-w-0">
              <div className="block transition-opacity duration-300 hover:opacity-60">
                <div className="ml-[-1px] w-[calc(100%+2px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="relative flex w-full items-center gap-3 border-b border-slate-200 bg-gray-50 px-[58px] py-3">
                    <div className="absolute left-4 top-1/2 flex -translate-y-1/2 gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                    </div>

                    <div className="flex-1 text-center font-mono text-xs text-slate-400">{project.url}</div>
                  </div>

                  <div className={`aspect-video w-full bg-gradient-to-br ${project.tone} p-6`}>
                    <div className="flex h-full items-end rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-lg backdrop-blur">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-sky-600">Product Preview</p>
                        <h3 className="mt-3 text-2xl font-light text-slate-800">{project.title}</h3>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                          Dashboard cards, content blocks và CTA gọn gàng giống kiểu trình bày trong mẫu tham chiếu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-2.5 mt-5 sm:mb-4 sm:mt-8">
                <h2 className="text-2xl font-light text-slate-800 sm:text-3xl">{project.title}</h2>
              </div>

              <p className="mb-4 text-base leading-7 text-slate-600 sm:mb-6 sm:text-lg">{project.description}</p>

              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 sm:gap-x-5 sm:text-base">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-1.5">
                    <CheckIcon className="h-5 w-5" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell title="Articles">
        <div className="space-y-6 sm:space-y-8">
          {articles.map((article) => (
            <article
              key={article.title}
              className="flex gap-7 rounded-xl border border-slate-200 bg-white p-5 shadow-lg max-sm:flex-col sm:gap-10 sm:rounded-2xl sm:p-10"
            >
              <div className={`sm:w-[240px] sm:shrink-0 rounded-xl bg-gradient-to-br ${article.tone} p-4 shadow-lg`}>
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

function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <h1 className="text-4xl font-light text-slate-800">Contact</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        Form thật sẽ được nối API ở bước tiếp theo. Hiện tại mình giữ cùng visual language với trang home để frontend nhìn liền mạch.
      </p>
      <form className="mt-8 grid gap-4">
        <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400" placeholder="Tên của bạn" />
        <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400" placeholder="Email" />
        <textarea rows="6" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400" placeholder="Nội dung liên hệ" />
        <button type="button" className="w-fit rounded-full bg-sky-600 px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:opacity-85">
          Send Message
        </button>
      </form>
    </section>
  );
}

function Highlight({ children, tone }) {
  return (
    <span className={`font-normal ${tone}`}>
      {children}
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

function CheckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default App;
