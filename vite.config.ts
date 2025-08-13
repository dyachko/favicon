import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: (globalThis as any)?.process?.env?.BASE_PATH || '/',
  server: {
    host: true,
    port: 5180,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 4180,
    strictPort: true,
  },
  plugins: [react()],
})
