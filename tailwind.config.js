/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: "#0a0d12"
        },
        secondary: {
          bg: "#1a1f2b"
        },
        shading: "#12151a",
        stock: "#25282f",
        "stock-dark": "#24282e",
        paragraph: "#8f949c",
        text: "#ffffff",
        hint: "#8e8e93",
        accent: "#007aff",
        button: {
          bg: "#171a20",
          border: "#20232b"
        },
        icon: {
          bg: "#21252c"
        }
      }
    }
  },
  plugins: []
}
