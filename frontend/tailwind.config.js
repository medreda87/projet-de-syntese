/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        accent: "var(--accent)",

        background: "var(--background)",
        foreground: "var(--foreground)",

        card: "var(--card)",

        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",

        border: "var(--border)",
        destructive: "var(--destructive)",

        "primary-light": "var(--background-primary-light)",
        "text-gray" : "var(--text-gray)",
        "text-dark" : "var(--text-dark)"
      },
    },
  },
  plugins: [],
};
