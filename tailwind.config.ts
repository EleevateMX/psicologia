import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7f6',
          100: '#d6ecea',
          200: '#aedad6',
          300: '#7cc1bc',
          400: '#4ea39e',
          500: '#358884',
          600: '#296c69',
          700: '#235755',
          800: '#1f4644',
          900: '#1c3b3a',
        },
        semaforo: {
          verde: '#16a34a',
          amarillo: '#eab308',
          rojo: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
