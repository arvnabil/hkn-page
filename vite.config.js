import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
      // Standalone mode: simulasikan Inertia client-side tanpa backend Laravel
      '@inertiajs/react': path.resolve(__dirname, 'resources/js/standalone/inertia-shim.jsx'),
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
  server: {
    port: 5173,
    open: true,
    watch: {
      ignored: ['**/trash/**', '**/legacy/**'],
    },
  },
});
