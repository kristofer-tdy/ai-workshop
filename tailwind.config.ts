import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        'bg-primary': '#0a0a0a',
        'bg-surface': '#111111',
        'bg-elevated': '#1a1a1a',

        // Neon accent colors
        'neon-cyan': '#00ffff',
        'neon-magenta': '#ff00ff',
        'neon-yellow': '#ffff00',
        'neon-green': '#00ff88',
        'neon-orange': '#ff8800',

        // Text colors
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        'text-muted': '#444444',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Presentation mode
        'hero': ['8rem', { lineHeight: '1' }],
        'section': ['4.5rem', { lineHeight: '1.1' }],
        'subtitle': ['3rem', { lineHeight: '1.2' }],
        'large': ['2rem', { lineHeight: '1.4' }],
        'body-lg': ['1.5rem', { lineHeight: '1.5' }],
        'caption': ['1.125rem', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px #00ffff, 0 0 40px rgba(0, 255, 255, 0.3)',
        'glow-magenta': '0 0 20px #ff00ff, 0 0 40px rgba(255, 0, 255, 0.3)',
        'glow-yellow': '0 0 20px #ffff00, 0 0 40px rgba(255, 255, 0, 0.3)',
        'glow-green': '0 0 20px #00ff88, 0 0 40px rgba(0, 255, 136, 0.3)',
        'glow-orange': '0 0 20px #ff8800, 0 0 40px rgba(255, 136, 0, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
