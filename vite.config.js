import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls to wrangler pages dev (port 8788) during frontend-only dev
    proxy: {
      '/api': 'http://localhost:8788',
    },
  },
});
