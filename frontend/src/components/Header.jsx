import { NavLink } from "react-router-dom";

function Header({ profile, language = "vi", onLanguageChange }) {
  const displayName = profile?.displayName || "Trung VQ";
  const brandInitials = profile?.brandInitials || "TV";
  const headerAvatarUrl = profile?.headerAvatarUrl || "";
  const navItems = [
    { to: "/projects", label: language === "en" ? "Projects" : "Dự án" },
    { to: "/work", label: language === "en" ? "Work" : "Kinh nghiệm" },
    { to: "/articles", label: language === "en" ? "Articles" : "Bài viết" },
    { to: "/contact", label: language === "en" ? "Contact" : "Liên hệ" }
  ];

  return (
    <header className="mx-auto mb-10 flex max-w-5xl flex-col items-center gap-6 sm:mb-14 sm:flex-row sm:items-start sm:justify-between sm:gap-10 xl:mb-20">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
      <NavLink
        to="/"
        className="shrink-0 transition-opacity duration-300 hover:opacity-80"
        aria-label={language === "en" ? "Back to home" : "Quay về trang chủ"}
      >
        {headerAvatarUrl ? (
          <img
            src={headerAvatarUrl}
            alt={displayName}
            className="h-[92px] w-[92px] rounded-full object-cover shadow-[0_20px_45px_rgba(14,165,233,0.24)] sm:h-[150px] sm:w-[150px]"
          />
        ) : (
          <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0f172a,_#0ea5e9)] text-3xl font-semibold text-white shadow-[0_20px_45px_rgba(14,165,233,0.24)] sm:h-[150px] sm:w-[150px] sm:text-5xl">
            {brandInitials}
          </div>
        )}
      </NavLink>

        <div>
        <NavLink
          to="/"
          className="inline-flex flex-col items-center text-2xl font-medium uppercase tracking-[0.28em] text-slate-800 after:mt-2 after:inline-block after:h-[6px] after:w-8 after:rounded-full after:bg-sky-600 sm:items-start sm:text-3xl"
        >
          {displayName}
        </NavLink>

        <nav className="mt-4 flex flex-wrap gap-4 sm:mt-6 sm:gap-8">
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
      </div>

      <div className="sm:pt-2">
        <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white p-1 shadow-sm shadow-slate-200/70">
          {[
            { value: "vi", label: "VI" },
            { value: "en", label: "EN" }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onLanguageChange?.(option.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.24em] transition-colors duration-300 sm:px-4 ${
                language === option.value
                  ? "bg-sky-50 text-sky-600 ring-1 ring-sky-100"
                  : "text-slate-500 hover:text-sky-600"
              }`}
              aria-pressed={language === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
