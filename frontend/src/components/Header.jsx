import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/work", label: "Work" },
  { to: "/articles", label: "Articles" },
  { to: "/contact", label: "Contact" }
];

function Header() {
  return (
    <header className="mx-auto mb-10 flex max-w-5xl flex-col items-center gap-6 sm:mb-14 sm:flex-row sm:gap-10 xl:mb-20">
      <div className="shrink-0">
        <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0f172a,_#0ea5e9)] text-3xl font-semibold text-white shadow-[0_20px_45px_rgba(14,165,233,0.24)] sm:h-[150px] sm:w-[150px] sm:text-5xl">
          TV
        </div>
      </div>

      <div>
        <NavLink
          to="/"
          className="inline-flex flex-col items-center text-2xl font-medium uppercase tracking-[0.28em] text-slate-800 after:mt-2 after:inline-block after:h-[6px] after:w-8 after:rounded-full after:bg-sky-600 sm:items-start sm:text-3xl"
        >
          Trung VQ
        </NavLink>

        <nav className="mt-4 flex gap-4 sm:mt-6 sm:gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium uppercase tracking-[0.24em] transition-colors duration-300 sm:text-lg ${
                  isActive ? "text-sky-600" : "text-slate-500 hover:text-sky-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
