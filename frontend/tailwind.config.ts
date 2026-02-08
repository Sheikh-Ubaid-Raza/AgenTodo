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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Cyber Slate specific colors
        cyber: {
          cyan: "#38fbdb",
          purple: "#8e52f5",
          magenta: "#fc0ff5",
          "dark-blue": "#0c1e3e",
          "navy": "#122c5a",
          "slate-600": "#606060",
          "slate-500": "#687387",
          "slate-400": "#8b94a5",
          "slate-300": "#88abb8",
          "slate-200": "#becbd6",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        "cyber": "0 0 0 1px rgba(56, 251, 219, 0.1), 0 4px 12px -2px rgba(56, 251, 219, 0.15), 0 8px 24px -4px rgba(142, 82, 245, 0.1)",
        "cyber-lg": "0 0 0 1px rgba(56, 251, 219, 0.1), 0 8px 24px -4px rgba(56, 251, 219, 0.2), 0 16px 48px -8px rgba(142, 82, 245, 0.15)",
        "cyber-glow": "0 0 20px rgba(56, 251, 219, 0.3), 0 0 40px rgba(142, 82, 245, 0.2), 0 0 60px rgba(252, 15, 245, 0.1)",
        "elevated": "0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.25), 0 12px 24px -6px rgba(0, 0, 0, 0.3)",
        "elevated-xl": "0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 8px 20px -4px rgba(0, 0, 0, 0.3), 0 24px 48px -12px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "gradient-cyber": "linear-gradient(135deg, #38fbdb 0%, #8e52f5 50%, #fc0ff5 100%)",
        "gradient-cyber-subtle": "linear-gradient(135deg, rgba(56, 251, 219, 0.15) 0%, rgba(252, 15, 245, 0.15) 100%)",
        "gradient-radial": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "chat-in": "chat-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "tool-pulse": "tool-pulse 1.5s ease-in-out infinite",
        "mcp-shimmer": "mcp-shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "typing-bounce": "typing-bounce 1.4s ease-in-out infinite",
      },
      keyframes: {
        "chat-slide-in": {
          from: { opacity: "0", transform: "translateY(16px) scale(0.95)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.15)", opacity: "0.4" },
          "100%": { transform: "scale(1.3)", opacity: "0" },
        },
        "tool-pulse": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(56, 251, 219, 0.5)" },
          "50%": { opacity: "0.85", boxShadow: "0 0 0 10px rgba(56, 251, 219, 0)" },
        },
        "mcp-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "typing-bounce": {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-4px)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
