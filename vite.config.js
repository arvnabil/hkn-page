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
  // Laravel serves the React entry from its Vite manifest. Avoid copying the
  // public directory: public/storage is a Docker-created symlink on Windows.
  publicDir: false,
  build: {
    outDir: 'public/build',
    emptyOutDir: true,
    manifest: 'manifest.json',
    rollupOptions: {
      input: [
        'resources/css/app.css',
        'resources/js/app.jsx',
        'resources/js/filament-serp.jsx',
      ],
    },
  },
  server: {
    port: 5173,
    open: true,
    watch: {
      ignored: ['**/trash/**', '**/legacy/**'],
    },
  },
});
