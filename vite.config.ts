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
    allowedHosts: ['localhost', 'dwarpal.in','cb9b-2405-201-a802-916f-2ddb-4b51-5321-c93c.ngrok-free.app'],
  }
  
})