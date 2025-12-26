import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        crimsonpro: ['var(--font-crimson-pro)', 'serif'], 
      },
      colors: {
        primaryGreen: '#0B3D0B',
        lightBackground: '#F5FFED',
      },
    },
  },
  plugins: [],
};
export default config;
