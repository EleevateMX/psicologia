import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Verde selva (color principal del safari)
        brand: {
          50: '#f3f8ec',
          100: '#e3efd2',
          200: '#c8e0a8',
          300: '#a6cb76',
          400: '#86b34e',
          500: '#679536',
          600: '#4f7728',
          700: '#3d5c22',
          800: '#334a20',
          900: '#2b3f1f',
        },
        // Ámbar sabana (acento cálido)
        sabana: {
          50: '#fdf8ed',
          100: '#f9ecc9',
          200: '#f2d68f',
          300: '#ebbc55',
          400: '#e6a42f',
          500: '#d6861d',
          600: '#bb6516',
          700: '#9c4916',
          800: '#7f3a18',
          900: '#693117',
        },
        semaforo: {
          verde: '#16a34a',
          amarillo: '#eab308',
          rojo: '#dc2626',
        },
      },
      backgroundImage: {
        selva:
          'radial-gradient(circle at 15% 20%, rgba(134,179,78,0.18), transparent 40%), radial-gradient(circle at 85% 0%, rgba(230,164,47,0.16), transparent 35%)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
