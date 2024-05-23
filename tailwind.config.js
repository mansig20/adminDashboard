/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#f3f9d2ff',
        'tea-green': '#cbeaa6ff',
        'pistachio': '#c0d684ff',
        'dark-purple': '#3d0b37ff',
        'violet-jtc': '#63264aff',  
        'old-rose': '#c78283ff',
    
      },
    },
  },
  plugins: [],
}

