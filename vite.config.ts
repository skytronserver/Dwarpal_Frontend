import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    open: true,
    allowedHosts: [
      'efe0-2405-201-a804-908f-907e-beb4-3217-f51e.ngrok-free.app',
      '3192-2405-201-a802-9035-e0a5-592e-8c90-76e.ngrok-free.app'
    ]
  }
})
