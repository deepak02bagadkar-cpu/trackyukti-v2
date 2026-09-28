import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#10264C",
          50: "#EEF3F9",
          100: "#D3E0EF",
          800: "#133161",
          900: "#10264C",
          950: "#091730"
        },
        blue: {
          DEFAULT: "#1869BE",
          50: "#EFF6FD",
          100: "#D7E8F9",
          500: "#1869BE",
          600: "#1457A0"
        },
        orange: {
          DEFAULT: "#F26914",
          50: "#FEF4EC",
          100: "#FCE3CE",
          500: "#F26914",
          600: "#D25408"
        },
        green: {
          DEFAULT: "#199D69",
          50: "#EDF9F3",
          100: "#D2F2E2",
          500: "#199D69",
          600: "#138054"
        },
        red: {
          DEFAULT: "#E83641",
          50: "#FDF0F1",
          100: "#F9D5D7",
          500: "#E83641",
          600: "#C61F2A"
        },
        purple: {
          DEFAULT: "#6543AC",
          50: "#F5F2FC",
          100: "#E6DDF7",
          500: "#6543AC",
          600: "#50338E"
        },
        mineBg: "#F8FAFC",
        mineText: "#162337",
        mineMuted: "#64748B",
        mineBorder: "#E2E8F0"
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(16, 38, 76, 0.05), 0 1px 3px -1px rgba(16, 38, 76, 0.03)",
        card: "0 4px 16px -2px rgba(16, 38, 76, 0.08)",
        floating: "0 10px 30px -4px rgba(16, 38, 76, 0.12)"
      }
    },
  },
  plugins: [],
};
export default config;
