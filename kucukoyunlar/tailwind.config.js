/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#f0f4ff',
          100: '#dbe4ff',
          200: '#bac8ff',
          300: '#91a7ff',
          400: '#748ffc',
          500: '#5c7cfa',
          600: '#4c6ef5',
          700: '#4263eb',
          800: '#3b5bdb',
          900: '#364fc7',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: '#f5f6fb',
          100: '#eaecf5',
          200: '#d5d9e9',
          300: '#b7bed8',
          400: '#959ebd',
          500: '#6e7ba1',
          600: '#5c6991',
          700: '#4d5775',
          800: '#41485e',
          900: '#383e4e',
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: '#fff3f1',
          100: '#ffe4df',
          200: '#ffcec5',
          300: '#ffaa99',
          400: '#ff7e6b',
          500: '#ff5e49',
          600: '#ff3a23',
          700: '#ff2205',
          800: '#e31d01',
          900: '#c61901',
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-roboto-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'game': '1rem',
      },
      boxShadow: {
        'game': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} 