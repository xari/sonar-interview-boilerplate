import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['**/*.test.tsx', '**/*.test.jsx', '**/*.test.ts', '**/*.test.js'],
    globals: true,
  },
});
