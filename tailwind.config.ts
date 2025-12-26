import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#0B3D0B',
        'bg-splash': '#F5FFED',
        'input-fill': 'rgba(233, 233, 233, 0.45)',
      },
      fontFamily: {
        crimsonPro: ['var(--font-crimson-pro)', 'serif'], 
      },
    },
  },
  plugins: [],
};

export default config;