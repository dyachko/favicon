import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: (globalThis as any)?.process?.env?.BASE_PATH || '/',
  plugins: [react()],
})
