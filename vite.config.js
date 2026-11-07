import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // libera o endereço do GitHub Codespaces
    allowedHosts: ['.app.github.dev'],
  },
})
