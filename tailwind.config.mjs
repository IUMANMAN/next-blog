/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lesswrong': {
          text: '#2B2B2B',
          link: '#5f9b65',
          'link-hover': '#3d7b43',
          background: '#F7F7F7',
          'nav-bg': '#FFFFFF',
          border: '#E8E8E8',
          meta: '#8C8C8C'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#2B2B2B',
            a: {
              color: '#5f9b65',
              '&:hover': {
                color: '#3d7b43',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
