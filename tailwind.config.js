/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Semantic tokens mapped to the CSS custom properties defined in index.css.
      // Single source of truth = the Aurora × Cortex design system.
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        panel: 'var(--panel)',
        'panel-2': 'var(--panel-2)',
        'panel-3': 'var(--panel-3)',
        rail: 'var(--rail)',
        'rail-2': 'var(--rail-2)',
        'rail-ink': 'var(--rail-ink)',
        'rail-ink-2': 'var(--rail-ink-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
        brand: 'var(--brand)',
        'brand-2': 'var(--brand-2)',
        'brand-soft': 'var(--brand-soft)',
        cyan: 'var(--cyan)',
        'cyan-soft': 'var(--cyan-soft)',
        violet: 'var(--violet)',
        'violet-soft': 'var(--violet-soft)',
        good: 'var(--good)',
        'good-soft': 'var(--good-soft)',
        warn: 'var(--warn)',
        'warn-soft': 'var(--warn-soft)',
        crit: 'var(--crit)',
        'crit-soft': 'var(--crit-soft)',
      },
      borderRadius: {
        card: 'var(--radius)',
        sm2: 'var(--radius-sm)',
      },
      boxShadow: {
        'card-sm': 'var(--shadow-sm)',
        card: 'var(--shadow)',
        glow: 'var(--glow)',
      },
      fontFamily: {
        sans: 'var(--sans)',
        mono: 'var(--mono)',
      },
      keyframes: {
        fade: {
          from: { opacity: 0, transform: 'translateY(4px)' },
          to: { opacity: 1, transform: 'none' },
        },
        pulse2: {
          '0%': { boxShadow: '0 0 0 0 rgba(18,161,80,.5)' },
          '70%': { boxShadow: '0 0 0 6px rgba(18,161,80,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(18,161,80,0)' },
        },
      },
      animation: {
        fade: 'fade .25s ease',
        pulse2: 'pulse2 2s infinite',
      },
    },
  },
  plugins: [],
}
