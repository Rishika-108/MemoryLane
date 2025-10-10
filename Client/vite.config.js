import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // your Vite dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // <-- your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
