import { wedgesTW } from "@lemonsqueezy/wedges";
import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "node_modules/@lemonsqueezy/wedges/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "2.5rem",
        sm: "2rem",
        lg: "2rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
      transitionTimingFunction: {
        "slow-cubic": "cubic-bezier(.3,.42,0,1)",
      },
    },
  },
  darkMode: "class",
  plugins: [wedgesTW(), tailwindAnimate],
};
export default config;
