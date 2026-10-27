import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the API runs on :4000; proxying /api keeps cookies same-origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': { target: process.env.VITE_DEV_API || 'http://localhost:4000', changeOrigin: true } },
  },
});
