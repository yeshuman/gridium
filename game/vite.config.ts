import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: enables React JSX transform and fast refresh
export default defineConfig({
  plugins: [react()],
})
