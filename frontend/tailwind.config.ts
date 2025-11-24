import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#1e293b',
        accent: '#22d3ee'
      }
    }
  },
  plugins: []
};

export default config;
