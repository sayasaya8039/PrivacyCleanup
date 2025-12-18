/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./popup.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // パステル水色系カラーパレット
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        dark: {
          bg: '#0F172A',
          surface: '#1E293B',
          text: '#E0F2FE',
          subtext: '#94A3B8',
        },
        light: {
          bg: '#F0F9FF',
          surface: '#E0F2FE',
          text: '#334155',
          subtext: '#64748B',
        },
      },
      borderRadius: {
        'xl': '12px',
      },
    },
  },
  plugins: [],
}
