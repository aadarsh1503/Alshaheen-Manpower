import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      // Proxy for sending emails
      '/api': {
        target: 'https://alshaheen.pro/send_to_a_mail.php',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove `/api` prefix
      },
      // Proxy for file upload
      '/upload': {
        target: 'https://alshaheen.pro/upload_file.php',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload/, ''), // Remove `/upload` prefix
      },
    },
  },
})
