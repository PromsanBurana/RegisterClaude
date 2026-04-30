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
        bg: '#0A0A0A',
        surface: '#111111',
        elevated: '#1A1A1A',
        line: {
          DEFAULT: '#262626',
          strong: '#3F3F46',
        },
        fg: {
          DEFAULT: '#FAFAFA',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        accent: {
          DEFAULT: '#6366F1',
          hover: '#818CF8',
          subtle: 'rgba(99, 102, 241, 0.10)',
          ring: 'rgba(99, 102, 241, 0.30)',
          cyan: '#22D3EE',
        },
        status: {
          gray: '#71717A',
          blue: '#3B82F6',
          green: '#10B981',
          red: '#EF4444',
        },
      },
      fontSize: {
        // SaaS-tuned, calmer than the old display scale
        'display-1': [
          'clamp(2.75rem, 6.5vw, 5.5rem)',
          { lineHeight: '1.02', letterSpacing: '-0.04em' },
        ],
        'display-2': [
          'clamp(2.25rem, 5vw, 4rem)',
          { lineHeight: '1.05', letterSpacing: '-0.03em' },
        ],
        'display-3': [
          'clamp(1.75rem, 3.6vw, 2.75rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em' },
        ],
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
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
        'glow-pulse': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        soft: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
        elevated:
          '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 18px 48px -16px rgba(0,0,0,0.7)',
        glow: '0 0 0 1px rgba(99,102,241,0.4), 0 0 32px -4px rgba(99,102,241,0.45)',
        ring: '0 0 0 4px rgba(99,102,241,0.25)',
      },
      backgroundImage: {
        'gradient-radial':
          'radial-gradient(closest-side, var(--tw-gradient-stops))',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
