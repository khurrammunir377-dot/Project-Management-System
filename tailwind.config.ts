import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-base':    '#0a0c0f',
        'bg-surface': '#101318',
        'bg-panel':   '#141820',
        'bg-card':    '#1a1f29',
        'bg-hover':   '#1f2535',
        'bg-active':  '#252c3a',

        // Borders
        'border-dim':    '#1e2330',
        'border-default':'#252c3a',
        'border-strong': '#333d52',
        'border-accent': '#00c8bc40',

        // Text
        'text-primary':   '#dce4f0',
        'text-secondary': '#7a8899',
        'text-muted':     '#404d60',
        'text-accent':    '#00d4c8',

        // Accent
        'accent':         '#00d4c8',
        'accent-dim':     '#00d4c820',
        'accent-blue':    '#0ea5e9',

        // Status
        'status-dev':     '#3b82f6',
        'status-test':    '#f59e0b',
        'status-prod':    '#10b981',
        'status-hold':    '#6b7280',
        'status-arch':    '#374151',
        'status-bug':     '#ef4444',
        'status-idea':    '#8b5cf6',
      },
      fontFamily: {
        mono: ['Calibri', 'Carlito', 'Candara', 'Segoe UI', 'Arial', 'sans-serif'],
        sans: ['Calibri', 'Carlito', 'Candara', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        'xs':  ['0.75rem', { lineHeight: '1.1rem' }],
        'sm':  ['0.8125rem', { lineHeight: '1.25rem' }],
      },
      borderRadius: {
        'none': '0',
        'sm':   '2px',
        DEFAULT:'3px',
        'md':   '4px',
        'lg':   '6px',
      },
      boxShadow: {
        'glow-accent': '0 0 12px 0 rgba(0,212,200,0.15)',
        'glow-blue':   '0 0 12px 0 rgba(14,165,233,0.15)',
        'panel':       'inset 0 1px 0 0 rgba(255,255,255,0.03)',
      },
      gridTemplateColumns: {
        'sidebar': '52px 1fr',
        'sidebar-expanded': '220px 1fr',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1.2s step-end infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
