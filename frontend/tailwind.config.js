// /** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,css}',
  ],
  safelist: [
    {
      pattern: /glass(-dark|-white)?/,
    },
    'text-color-primary',
    'text-color-secondary',
    'bg-color-primary',
  ],
  theme: {
    extend: {
      colors: {
        'color-primary': '#1A092A',
        'color-secondary': '#BBAED0',
        'color-text-primary': '#F0E6F6',
        'color-text-secondary': '#BBAED0',
      },
      backdropBlur: {
        xs: '2px',
      },
      zIndex: {
        '-1': '-1',
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, addUtilities}) {
      addComponents({
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '1rem',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(255, 255, 255, 0.05)',
        },
        '.glass-white': {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
      });

      addUtilities({
        '.text-color-primary': {
          color: '#CA8A04',
        },
        '.text-color-secondary': {
          color: '#FFFFFF',
        },
        '.bg-color-primary': {
          backgroundColor: '#1A092A',
        },
      });
    }),
  ],
};