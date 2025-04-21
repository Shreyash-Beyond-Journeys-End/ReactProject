/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'game-primary': '#6366f1',
        'game-secondary': '#4f46e5',
        'game-accent': '#8b5cf6',
        'game-dark': '#1f2937',
        'game-light': '#f3f4f6',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shine': 'shine 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      boxShadow: {
        'game': '0 0 15px rgba(99, 102, 241, 0.4)',
        'game-hover': '0 0 20px rgba(99, 102, 241, 0.6)',
      },
      backgroundImage: {
        'gradient-game': 'linear-gradient(45deg, #6366f1, #4f46e5, #8b5cf6)',
        'gradient-game-dark': 'linear-gradient(45deg, #312e81, #1e1b4b, #4c1d95)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}