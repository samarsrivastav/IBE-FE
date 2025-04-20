import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "kickdrum-j0",
    project: "javascript-react"
  }), sentryVitePlugin({
    org: "kickdrumtech-2d",
    project: "javascript-react"
  })],

  build: {
    sourcemap: true
  },
  test: {
    // 👋 add the line below to add jsdom to vite
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    },
    allowedHosts: ['7b7f-103-211-17-237.ngrok-free.app']
  }
} as UserConfig)