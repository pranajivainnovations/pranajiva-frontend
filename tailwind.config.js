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
        /* ── Premium Ayurvedic palette ───────────────────── */
        surface: {
          DEFAULT: '#F7F5F2',
          warm: '#EFEAE4',
          muted: '#E8E2DA',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          light: '#6B6B6B',
          faint: '#9A9A9A',
        },
        accent: {
          DEFAULT: '#C2A36B',
          dark: '#A8894F',
          soft: '#C2A36B1F',
        },
        brand: {
          dark: '#2B2524',
        },
        /* ── Legacy / stealth ───────────────────────────── */
        'sage-primary': '#2D3A30',
        prana: { sage: '#2D3A30', mint: '#9ADBC6', champagne: '#F7EBA5' },
        champagne: '#F7EBA5',
        unbleached: '#F7F5F2',
        sand: { muted: '#EFEAE4' },
        charcoal: { soft: '#1A1A1A' },
        cream: '#FFFEF7',
        success: '#6AA495',
        error: '#D9534F',
        stealth: { bg: '#F5F5F5', text: '#333333', accent: '#0066CC' },
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      fontSize: {
        display: ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        title:   ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        subtitle: ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        caption: ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.12em', fontWeight: '500' }],
      },
      borderRadius: {
        card: '8px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.06)',
        elevated: '0 16px 48px rgba(0,0,0,0.08)',
      },
      backdropBlur: { xs: '2px' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
    },
  },
  plugins: [],
};
