import baseConfig from './assets/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './index.html',
    './resources/js/**/*.{js,jsx,ts,tsx}',
  ],
};

