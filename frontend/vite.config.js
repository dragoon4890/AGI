import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 4173,  // Port for the preview server
    strictPort: true,  // Ensure the port is strictly used, fail if unavailable
  },
  server: {
    port: 4173,  // Port for the development server
    strictPort: true,  // Ensure the port is strictly used, fail if unavailable
    host: true,  // Listen on all network interfaces
    origin: "http://localhost:4173",  // Set the origin for the development server
  }
})
