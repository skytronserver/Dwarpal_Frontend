import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    open: true,
    allowedHosts: [
      '5482-2405-201-a802-9035-d823-bfca-bb39-d96b.ngrok-free.app'
    ]
  }
})