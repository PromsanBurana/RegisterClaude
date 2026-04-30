/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', 'Archivo', 'system-ui', 'sans-serif'],
        display: ['"Archivo Black"', '"IBM Plex Sans Thai"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: '#0A0A0A',
        graphite: '#1F1F1F',
        smoke: '#6E6E6E',
        cream: '#F4EFE3',
        bone: '#F8F5EC',
        paper: '#FFFFFF',
        sun: {
          DEFAULT: '#FFD83D',
          dark: '#F5C300',
        },
        signal: '#FF4D14',
        electric: '#1F3DFF',
      },
      fontSize: {
        'display-1': ['clamp(3rem, 11vw, 11rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'display-2': ['clamp(2.5rem, 7vw, 6.5rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-3': ['clamp(2rem, 5vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
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
      },
    },
  },
  plugins: [],
};
