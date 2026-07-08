/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette for "Reach The Launch"
        ink: '#0B1220',        // near-black navy background
        surface: '#111A2E',    // card surface
        surface2: '#16223A',
        gold: '#D4AF6A',       // signature accent (launch = gold key moment)
        gold2: '#F0CE8B',
        teal: '#1FB6A6',       // secondary accent
        mist: '#8B96A8',       // muted text
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(212,175,106,0.25)',
      },
    },
  },
  plugins: [],
}
