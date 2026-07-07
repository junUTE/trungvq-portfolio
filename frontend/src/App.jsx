import { NavLink, Route, Routes } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
  { to: "/admin/login", label: "Admin Login" },
  { to: "/admin", label: "Admin Dashboard" }
];

const projectIdeas = [
  "Portfolio CMS with admin CRUD",
  "E-commerce analytics dashboard",
  "Booking or productivity side project"
];

const skillGroups = [
  { title: "Frontend", items: ["React", "Tailwind CSS", "React Router"] },
  { title: "Backend", items: ["Node.js", "Express", "REST API"] },
  { title: "Data & Ops", items: ["MongoDB Atlas", "JWT Auth", "Vercel / Render"] }
];

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.28),_transparent_28%),linear-gradient(180deg,_#07101d_0%,_#0f172a_45%,_#08101b_100%)] text-sand">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 lg:px-10">
        <header className="mb-10 rounded-full border border-white/10 bg-white/5 px-5 py-4 shadow-panel backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-display text-2xl tracking-wide">TrungVQ Portfolio</p>
              <p className="text-sm text-mist">Day 1 foundation with public pages and admin entry points.</p>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 transition ${
                      isActive ? "bg-accent text-slate-950" : "bg-white/5 text-sand hover:bg-white/10"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage projectIdeas={projectIdeas} />} />
            <Route path="/about" element={<InfoPage title="About" description="A short career story, current focus, values, and what kind of roles you are targeting." />} />
            <Route path="/skills" element={<SkillsPage groups={skillGroups} />} />
            <Route path="/projects" element={<ProjectsPage projectIdeas={projectIdeas} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/login" element={<InfoPage title="Admin Login" description="Reserved route for the private sign-in form and future token or cookie-based auth flow." />} />
            <Route path="/admin" element={<InfoPage title="Admin Dashboard" description="Reserved dashboard shell for project CRUD, contact management, and profile updates." />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function HomePage({ projectIdeas }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <article className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-panel backdrop-blur">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-accent">Full-stack portfolio</p>
        <h1 className="max-w-2xl font-display text-5xl leading-tight text-white">
          Building a practical portfolio that looks strong to recruiters and scales into an admin-managed product.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-mist">
          This starter already includes the public sitemap, admin entry points, environment template, and a backend
          health endpoint so you can move into UI and API work on day 2 and day 3 without reshaping the project.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Pill>React + Vite</Pill>
          <Pill>Tailwind CSS</Pill>
          <Pill>Express API</Pill>
          <Pill>Mongo-ready structure</Pill>
        </div>
      </article>

      <aside className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-panel">
        <h2 className="font-display text-2xl text-white">Starter project list</h2>
        <ul className="mt-5 space-y-4 text-mist">
          {projectIdeas.map((project) => (
            <li key={project} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              {project}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

function InfoPage({ title, description }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-panel">
      <p className="text-sm uppercase tracking-[0.35em] text-accent">Sitemap placeholder</p>
      <h1 className="mt-4 font-display text-4xl text-white">{title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-mist">{description}</p>
    </section>
  );
}

function SkillsPage({ groups }) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-accent">Skills map</p>
        <h1 className="mt-4 font-display text-4xl text-white">Technical areas prepared for the portfolio</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {groups.map((group) => (
          <article key={group.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-panel">
            <h2 className="font-display text-2xl text-white">{group.title}</h2>
            <ul className="mt-4 space-y-3 text-mist">
              {group.items.map((item) => (
                <li key={item} className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsPage({ projectIdeas }) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-accent">Projects overview</p>
        <h1 className="mt-4 font-display text-4xl text-white">Planned project slots for MVP</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projectIdeas.map((project, index) => (
          <article key={project} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-panel">
            <p className="text-sm text-accent">Project 0{index + 1}</p>
            <h2 className="mt-2 font-display text-2xl text-white">{project}</h2>
            <p className="mt-3 text-sm leading-6 text-mist">
              Replace this placeholder with a real summary, technology tags, GitHub link, and demo link on day 4.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <article className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-panel">
        <p className="text-sm uppercase tracking-[0.35em] text-accent">Contact plan</p>
        <h1 className="mt-4 font-display text-4xl text-white">Ready for API integration</h1>
        <p className="mt-4 text-base leading-7 text-mist">
          The backend is prepared for an `/api/health` check today. Day 3 and day 4 can extend this with contact
          storage, email delivery, validation, and status messaging in the UI.
        </p>
      </article>
      <form className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-panel">
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm text-mist">Name</span>
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Your name" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-mist">Email</span>
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="you@example.com" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-mist">Message</span>
            <textarea
              rows="5"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              placeholder="Tell me about your project or role."
            />
          </label>
          <button type="button" className="rounded-full bg-accent px-5 py-3 font-medium text-slate-950 transition hover:brightness-110">
            UI only for day 1
          </button>
        </div>
      </form>
    </section>
  );
}

function Pill({ children }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">{children}</span>;
}

export default App;
