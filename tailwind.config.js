/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '"Inter Variable"',
          '"IBM Plex Sans Thai"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'Inter',
          '"Inter Variable"',
          '"IBM Plex Sans Thai"',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: '#F7F7FB',
        surface: '#FFFFFF',
        elevated: '#FAFAFB',
        ink: '#111111',
        line: {
          DEFAULT: '#E4E4E7',
          strong: '#D4D4D8',
        },
        fg: {
          DEFAULT: '#111111',
          secondary: '#52525B',
          muted: '#71717A',
        },
        brand: {
          purple: '#7B61FF',
          'purple-soft': '#A492FF',
          orange: '#FF7A00',
          'orange-soft': '#FF9533',
          cyan: '#00C2FF',
          'cyan-soft': '#5AD7FF',
          pink: '#FF4ECD',
          'pink-soft': '#FF85DC',
        },
        status: {
          gray: '#71717A',
          blue: '#3B82F6',
          green: '#10B981',
          red: '#EF4444',
        },
      },
      fontSize: {
        'display-1': [
          'clamp(2.75rem, 7vw, 6rem)',
          { lineHeight: '1', letterSpacing: '-0.04em' },
        ],
        'display-2': [
          'clamp(2.25rem, 5vw, 4.25rem)',
          { lineHeight: '1.04', letterSpacing: '-0.03em' },
        ],
        'display-3': [
          'clamp(1.75rem, 3.6vw, 2.75rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em' },
        ],
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        float: 'float 8s ease-in-out infinite',
        'float-slow': 'float 14s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 14s ease infinite',
        'gradient-text': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-18px,0)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(17, 17, 17, 0.04), 0 8px 24px -10px rgba(17, 17, 17, 0.08)',
        card: '0 1px 2px rgba(17, 17, 17, 0.04), 0 12px 32px -12px rgba(17, 17, 17, 0.10)',
        elevated:
          '0 1px 3px rgba(17, 17, 17, 0.06), 0 24px 60px -20px rgba(17, 17, 17, 0.18)',
        glow:
          '0 0 0 1px rgba(123, 97, 255, 0.18), 0 18px 48px -12px rgba(123, 97, 255, 0.30)',
        'glow-orange':
          '0 0 0 1px rgba(255, 122, 0, 0.20), 0 18px 48px -14px rgba(255, 122, 0, 0.45)',
      },
      backgroundImage: {
        'mesh-hero':
          'radial-gradient(60% 50% at 18% 22%, rgba(123,97,255,0.32), transparent 70%), radial-gradient(50% 45% at 82% 14%, rgba(0,194,255,0.28), transparent 70%), radial-gradient(55% 50% at 70% 86%, rgba(255,78,205,0.28), transparent 70%), radial-gradient(45% 40% at 14% 84%, rgba(255,122,0,0.20), transparent 70%)',
        'gradient-brand':
          'linear-gradient(110deg, #7B61FF 0%, #FF4ECD 45%, #00C2FF 100%)',
        'gradient-warm':
          'linear-gradient(110deg, #FF7A00 0%, #FF4ECD 100%)',
        'gradient-cool':
          'linear-gradient(110deg, #7B61FF 0%, #00C2FF 100%)',
      },
    },
  },
  plugins: [],
};
