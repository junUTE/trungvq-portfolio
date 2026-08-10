/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    "underline",
    "decoration-2",
    "underline-offset-4",
    "decoration-sky-500",
    "decoration-cyan-500",
    "decoration-blue-500",
    "decoration-indigo-500",
    "decoration-violet-500",
    "decoration-fuchsia-500",
    "decoration-pink-500",
    "decoration-rose-500",
    "decoration-orange-500",
    "decoration-amber-500",
    "decoration-emerald-500",
    "decoration-teal-500",
    "decoration-lime-500",
    "text-slate-700",
    "text-slate-800"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#09111f",
        accent: "#f97316",
        sand: "#f8f1e7",
        mist: "#b8c4d6"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Segoe UI", "sans-serif"]
      },
      boxShadow: {
        panel: "0 24px 80px rgba(15, 23, 42, 0.22)"
      }
    }
  },
  plugins: []
};
