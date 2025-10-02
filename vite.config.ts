import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
  test: { environment: 'jsdom', setupFiles: './src/setupTests.ts',
    globals: true,
    css: true,
    coverage: { enabled: false }
   }
})
