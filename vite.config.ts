import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { execSync } from 'node:child_process'

const getCurrentBranch = () => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  } catch {
    return ''
  }
}

const currentBranch = getCurrentBranch()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: currentBranch === 'Pages' ? 'pagesRoot' : 'dist',
  },
  server: {
    host: true,
    port: 8888,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
