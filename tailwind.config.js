/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#10b981', // Emerald green
          hover: '#059669',
          light: '#34d399',
          subtle: 'rgba(16, 185, 129, 0.12)',
          cyan: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      maxWidth: {
        'reading': '720px',
      },
      lineHeight: {
        'relaxed-editorial': '1.8',
      }
    },
  },
  plugins: [],
}
