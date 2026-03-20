import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: 'var(--border)',
        background: 'var(--bg-base)',
        foreground: 'var(--text-primary)',
      },
      borderRadius: {
        lg: '8px',
      },
    },
  },
  plugins: [],
} satisfies Config;
