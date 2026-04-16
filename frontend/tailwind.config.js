export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          main: 'rgb(var(--brand-main) / <alpha-value>)',
          mainHover: 'rgb(var(--brand-main-hover) / <alpha-value>)',
          accent: 'rgb(var(--brand-accent) / <alpha-value>)',
          bg: 'rgb(var(--brand-bg) / <alpha-value>)',
          surface: 'rgb(var(--brand-surface) / <alpha-value>)',
          surface2: 'rgb(var(--brand-surface2) / <alpha-value>)',
          text: 'rgb(var(--brand-text) / <alpha-value>)',
          textSecondary: 'rgb(var(--brand-text-secondary) / <alpha-value>)',
          neutral: 'rgb(var(--brand-neutral) / <alpha-value>)',
          dark: 'rgb(var(--brand-main) / <alpha-value>)',
          darkHover: 'rgb(var(--brand-main-hover) / <alpha-value>)',
          soft: 'rgb(var(--brand-bg) / <alpha-value>)',
        },
        status: {
          error: 'rgb(var(--status-error) / <alpha-value>)',
          success: 'rgb(var(--status-success) / <alpha-value>)',
        },
      },
      boxShadow: {
        soft: '0 16px 40px rgb(var(--brand-dark) / 0.10)',
      },
    },
  },
  plugins: [],
};
