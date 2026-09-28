/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        dark: "#1e293b",
        light: "#f8fafc",
      }
    },
  },
  plugins: [],
}
