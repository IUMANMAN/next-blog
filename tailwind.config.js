/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: true,
  theme: {
    extend: {
      fontSize: {
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      colors: {
        'lesswrong-bg': 'var(--lesswrong-bg)',
        'lesswrong-text': 'var(--lesswrong-text)',
        'lesswrong-meta': 'var(--lesswrong-meta)',
        'lesswrong-link': 'var(--lesswrong-link)',
        'lesswrong-link-hover': 'var(--lesswrong-link-hover)',
        'lesswrong-border': 'var(--lesswrong-border)',
        'lesswrong-nav-bg': 'var(--lesswrong-nav-bg)',
        'lesswrong-green-light': 'var(--lesswrong-green-light)',
        'lesswrong-green-border': 'var(--lesswrong-green-border)',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.lesswrong-text'),
            maxWidth: 'none',
            a: {
              color: theme('colors.lesswrong-link'),
              '&:hover': {
                color: theme('colors.lesswrong-link-hover'),
              },
              textDecoration: 'none',
            },
            h1: {
              color: theme('colors.lesswrong-text'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.lesswrong-text'),
              fontWeight: '600',
            },
            h3: {
              color: theme('colors.lesswrong-text'),
              fontWeight: '600',
            },
            blockquote: {
              color: theme('colors.lesswrong-text/80'),
              borderLeftColor: theme('colors.lesswrong-border'),
            },
            code: {
              color: theme('colors.lesswrong-text'),
              backgroundColor: theme('colors.lesswrong-border/20'),
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 