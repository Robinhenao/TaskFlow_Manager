/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#3069FE",
        accent: "#F8C51B",

        text: {
          dark: "#252C32",
          base: "#373E44",
          gray: "#787878",
          light: "#989B9E"
        },

        border: "#DDE2E4",
        bg: "#F7F9FC"
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },

      borderRadius: {
        lg: "12px",
        xl: "16px"
      },

      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.05)"
      }
    }
  },
  plugins: []
}