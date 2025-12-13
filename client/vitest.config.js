import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,               // allows "describe", "test", "expect" without imports
    environment: 'jsdom',        // needed for React DOM testing
    setupFiles: './src/setupTests.js', // run before tests (we'll create it next)
    include: [
      'components/**/*.test.{js,jsx,ts,tsx}',
      'src/**/*.test.{js,jsx,ts,tsx}',
    ],
  },
});
