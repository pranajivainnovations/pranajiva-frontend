/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // PranaJiva Brand Colors
        'sage-primary': '#2D3A30', // Primary brand color
        prana: {
          sage: '#2D3A30', // Primary brand color for nav and selections
          mint: '#9ADBC6',
          champagne: '#F7EBA5',
        },
        champagne: '#F7EBA5', // Accent gold color
        unbleached: '#F9F7F2',
        sand: {
          muted: '#EEDBC3',
        },
        charcoal: {
          soft: '#1A1A1A',
        },
        cream: '#FFFEF7', // Text color on dark backgrounds
        success: '#6AA495',
        error: '#D9534F',
        // Stealth mode colors
        stealth: {
          bg: '#F5F5F5',
          text: '#333333',
          accent: '#0066CC',
        },
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Josefin Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-in-out',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
