/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hijau: {
          DEFAULT: "#1D9E75",
          muda: "#E1F5EE",
          tua: "#085041",
          border: "#9FE1CB",
        },
        kuning: {
          DEFAULT: "#EF9F27",
          muda: "#FAEEDA",
        },
        abu: {
          DEFAULT: "#888780",
          muda: "#F1EFE8",
        },
      },
    },
  },
  plugins: [],
}