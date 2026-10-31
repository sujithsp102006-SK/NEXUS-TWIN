/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        twin: {
          darkest: '#070B14',
          bg: '#0A0F1D',
          card: '#0F172A',
          cardHover: '#131E35',
          border: '#1E293B',
          borderFocus: '#38BDF8',
          textMuted: '#94A3B8',
          textPrimary: '#F8FAFC',
          cyan: '#06B6D4',
          blue: '#3B82F6',
          indigo: '#6366F1',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}

