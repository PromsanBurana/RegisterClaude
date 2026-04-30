/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', 'Inter', 'Archivo', 'system-ui', 'sans-serif'],
        display: ['"Archivo Black"', '"IBM Plex Sans Thai"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: '#050505',
        graphite: '#1A1A1A',
        smoke: '#6B6B6B',
        paper: '#FFFFFF',
        cream: '#FAFAF7',
        bone: '#F2F2EE',
        gray: {
          soft: '#EAEAEA',
          mid: '#9A9A9A',
        },
        sun: {
          DEFAULT: '#FFD400',
          dark: '#E5BE00',
          deep: '#C9A800',
        },
        signal: '#FF1F1F',
        electric: '#0052FF',
      },
      fontSize: {
        'display-mega': [
          'clamp(3.5rem, 14vw, 14rem)',
          { lineHeight: '0.85', letterSpacing: '-0.045em' },
        ],
        'display-1': [
          'clamp(3rem, 11.5vw, 11.5rem)',
          { lineHeight: '0.88', letterSpacing: '-0.04em' },
        ],
        'display-2': [
          'clamp(2.5rem, 8.5vw, 8.5rem)',
          { lineHeight: '0.9', letterSpacing: '-0.03em' },
        ],
        'display-3': [
          'clamp(2rem, 5.5vw, 5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.02em' },
        ],
        'display-stat': [
          'clamp(3.5rem, 11vw, 9rem)',
          { lineHeight: '0.85', letterSpacing: '-0.04em' },
        ],
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
        'marquee-fast': 'marquee 18s linear infinite',
        'spin-slow': 'spin 14s linear infinite',
        'spin-slower': 'spin 30s linear infinite',
        blink: 'blink 1.2s step-end infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      borderWidth: {
        3: '3px',
        5: '5px',
      },
      boxShadow: {
        offset: '6px 6px 0 0 #050505',
        'offset-lg': '10px 10px 0 0 #050505',
        'offset-sun': '6px 6px 0 0 #FFD400',
      },
    },
  },
  plugins: [],
};
