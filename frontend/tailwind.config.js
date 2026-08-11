/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    "underline",
    "decoration-2",
    "underline-offset-4",
    "bg-slate-500",
    "bg-gray-500",
    "bg-zinc-500",
    "bg-neutral-500",
    "bg-stone-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-blue-600",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
    "text-sky-600",
    "text-cyan-600",
    "text-blue-600",
    "text-indigo-600",
    "text-violet-600",
    "text-fuchsia-600",
    "text-pink-600",
    "text-rose-600",
    "text-orange-600",
    "text-amber-600",
    "text-emerald-600",
    "text-teal-600",
    "text-lime-600",
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
    "decoration-lime-500"
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
