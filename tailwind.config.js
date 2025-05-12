/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      keyframes: {
        pulse: {
          '0%, 100%': { 'background-position': '0% 0%' },
          '50%': { 'background-position': '100% 100%', opacity: '0.5' }
        },
        glow: {
          '0%, 100%': { 'box-shadow': '0 0 15px rgba(255,107,0,0.3)' },
          '50%': { 'box-shadow': '0 0 25px rgba(255,107,0,0.5)' }
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        ripple: {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' }
        },
        slideUp: {
          '0%': { height: '0%' },
          '100%': { height: 'var(--target-height)' }
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        },
        wave: {
          '0%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.5)' },
          '100%': { transform: 'scaleY(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      animation: {
        'wave-1': 'wave 1s ease-in-out infinite',
        'wave-2': 'wave 1s ease-in-out infinite 0.1s',
        'wave-3': 'wave 1s ease-in-out infinite 0.2s',
        'wave-4': 'wave 1s ease-in-out infinite 0.3s',
        'wave-5': 'wave 1s ease-in-out infinite 0.4s',
        'glow': 'glow 3s ease-in-out infinite',
        'rotate': 'rotate 20s linear infinite',
        'ripple': 'ripple 3s ease-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 8s ease-in-out infinite'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
