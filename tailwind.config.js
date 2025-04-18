/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d4e9e', // Kids R Kids Blue
        secondary: '#00a5df', // Accent Blue
        gold: '#fbb040',
        light: '#f7f7f7',
        dark: '#232323',
      },
      fontFamily: {
        sans: [
          'Montserrat',
          'Open Sans',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        heading: [
          'Montserrat',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        body: [
          'Open Sans',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        handwriting: [
          'Schoolbell',
          'cursive'
        ],
        'parent-note': [
          'Coming Soon',
          'cursive'
        ],
      },
    },
  },
  plugins: [],
}
