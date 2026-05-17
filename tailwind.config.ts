import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import containerQueries from '@tailwindcss/container-queries';

export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        void: 'hsl(var(--void))',
        carbon: 'hsl(var(--carbon))',
        smoke: 'hsl(var(--smoke))',
        ash: 'hsl(var(--ash))',
        footer: 'hsl(var(--footer))',
        'accent-glow': 'hsl(var(--accent-glow) / 0.15)',
        'accent-dim': 'hsl(var(--accent-dim) / 0.08)',
        'company-grey': 'hsl(var(--company-grey))',
        taupe: 'hsl(var(--taupe))',
        'taupe-muted': 'hsl(var(--taupe-muted))',
        'hero-orange': 'hsl(var(--hero-orange))',
        'hero-orange-dark': 'hsl(var(--hero-orange-dark))',
        'accent-on-grey': 'hsl(var(--accent-on-grey))',
        'black-rich': 'hsl(var(--black-rich))',
        'black-muted': 'hsl(var(--black-muted))',
        'white-pure': 'hsl(var(--white-pure))',
        'white-70': 'hsl(var(--white-70))',
        'white-40': 'hsl(var(--white-40))',
        'white-15': 'hsl(var(--white-15))',
        warning: 'hsl(var(--warning))',
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        border: 'hsl(var(--ash))',
        input: 'hsl(var(--ash))',
        ring: 'hsl(var(--accent))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--void))' },
        secondary: { DEFAULT: 'hsl(var(--carbon))', foreground: 'hsl(var(--white-pure))' },
        destructive: { DEFAULT: 'hsl(var(--error))', foreground: 'hsl(var(--white-pure))' },
        muted: { DEFAULT: 'hsl(var(--smoke))', foreground: 'hsl(var(--white-70))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--void))' },
        popover: { DEFAULT: 'hsl(var(--carbon))', foreground: 'hsl(var(--white-pure))' },
        card: { DEFAULT: 'hsl(var(--carbon))', foreground: 'hsl(var(--white-pure))' },
      },
      fontFamily: {
        sans: ['var(--font-klavika)', 'Klavika Fallback', 'sans-serif'],
        display: ['var(--font-klavika)', 'Klavika Fallback', 'sans-serif'],
        editorial: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-klavika)', 'Klavika Fallback', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
    },
  },
  plugins: [tailwindcssAnimate, containerQueries],
} satisfies Config;
