import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // neutral base + an accent
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222 47% 11%)',
        muted: 'hsl(215 16% 92%)',
        border: 'hsl(214 18% 86%)',
        ring: 'hsl(215 20% 65%)',
        accent: {
          DEFAULT: 'hsl(221 83% 53%)', // blue-600 vibe
          fg: 'white',
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.06)',
      }
    }
  },
  plugins: [],
} satisfies Config