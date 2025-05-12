/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        blink: 'blink 1s step-start infinite',
      },
    },
    keyframes: {
        blink: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

