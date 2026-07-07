/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
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
