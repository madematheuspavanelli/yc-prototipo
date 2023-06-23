module.exports = {
  purge: ["./public/**/*.html", "./src/**/*.vue"],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Campton"]
      },
      colors: {
        youcheckin: {
          green: " #7DCB44",
          gray: {
            light: "#DADADA",
            DEFAULT: "#979797",
            dark: "#2A2C2E"
          },
          red: "#FF3A29",
          yellow: "#FFD400",
          blue: "#2A97FF"
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
