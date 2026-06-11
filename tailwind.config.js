/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        verde: '#00E676',
        'verde-escuro': '#00A85A',
        amarelo: '#FFD600',
        laranja: '#FF6D00',
        'laranja-claro': '#FF9100',
        vermelho: '#FF1744',
        marrom: '#8B0000',
        'bg-light': '#f0f5f1',
        'bg-white': 'rgba(255, 255, 255, 0.82)',
        'bg-card': 'rgba(255, 255, 255, 0.75)',
        'bg-dark': '#0f2a1e',
        'text-dark': '#1a2e3c',
        'text-light': '#5a6d7a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '16px',
        sm: '10px',
        lg: '24px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.06)',
        hover: '0 12px 40px rgba(0, 0, 0, 0.14)',
      },
      transitionDuration: {
        DEFAULT: '0.35s',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.glass-sm': {
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.card-lift': {
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.14)',
          },
        },
        '.section-padding': {
          padding: '100px 5%',
          '@media (max-width: 480px)': {
            padding: '60px 4%',
          },
        },
      });
    }),
  ],
};
