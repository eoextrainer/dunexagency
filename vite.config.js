import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Serves /eoexagency/landing (no extension) as landing.html in dev and preview
function landingRoutePlugin() {
  const rewrite = (req, _res, next) => {
    if (req.url === '/eoexagency/landing' || req.url === '/eoexagency/landing/') {
      req.url = '/eoexagency/landing.html'
    }
    next()
  }
  return {
    name: 'landing-clean-url',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), landingRoutePlugin()],
  base: '/eoexagency/',
  server: {
    port: 3000,
    host: '0.0.0.0',
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'res/build',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        landing: path.resolve(__dirname, 'landing.html'),
      },
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
})
