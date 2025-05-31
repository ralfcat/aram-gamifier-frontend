// --- file: frontend/tailwind.config.ts ---
import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Chakra Petch', 'system-ui', 'sans-serif'],
      },
      colors: {
        backdrop: 'rgba(255,255,255,0.1)',
        glass: 'rgba(255,255,255,0.25)',
        neon: {
          blue: '#43a6ff',
          purple: '#a066ff',
          silver: '#d4d7dd',
          green: '#50fa7b',
        },
      },
      backdropBlur: {
        glass: '12px',
      },
      backgroundColor: {
        'glass-strong': 'rgba(0, 0, 0, 0.4)',
        'glass-light': 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
} satisfies Config;