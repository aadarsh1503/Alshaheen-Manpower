import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  // server: {
  //   proxy: {
  //     // This will proxy all requests starting with /api to your Node server
  //     '/api': {
  //       target: 'http://localhost:5000',
  //       changeOrigin: true,
  //       secure: false,
  //       // rewrite: (path) => path.replace(/^\/api/, ''), 
  //       // ^ KEEP COMMENTED OUT because your Node routes expect the "/api" prefix
  //     },
  //     // If you still need the old PHP upload script, keep this:
  //     '/upload-legacy': {
  //       target: 'https://alshaheen.pro/upload_file.php',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/upload-legacy/, ''),
  //     },
  //   },
  // },
})