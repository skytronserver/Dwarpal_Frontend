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
    allowedHosts: ['localhost', 'dwarpal.in','8d01-2405-201-a802-916f-410d-3c6-f639-b45d.ngrok-free.app'],
  }
  
})