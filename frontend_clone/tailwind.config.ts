// tailwind.config.ts
import type { Config } from "tailwindcss";

export default <Config>{
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [],
};
