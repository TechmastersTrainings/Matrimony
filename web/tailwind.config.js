/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#172554',
          navy: '#172554',
          hover: '#1e3a8a',
        },
        secondary: {
          DEFAULT: '#1D4ED8',
          blue: '#1D4ED8',
        },
        accent: {
          DEFAULT: '#C9A227',
          gold: '#C9A227',
          light: '#FEF3C7',
          deep: '#854D0E',
        },
        ivory: '#FAF9F6',
        charcoal: '#17202A',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
};
