import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const ACTIVE_PROFILE_IDS = Array.from({ length: 62 }, (_, index) => index + 1)

const PROFILE_ID_SET = new Set(ACTIVE_PROFILE_IDS.map((id) => String(id)))

// Serves /eoexagency/landing (no extension) as landing.html in dev and preview
function landingRoutePlugin() {
  const rewrite = (req, _res, next) => {
    const profileMatch = req.url.match(/^\/eoexagency\/profiles\/profile-(\d+)\/?$/)

    if (req.url === '/eoexagency/landing' || req.url === '/eoexagency/landing/') {
      req.url = '/eoexagency/landing.html'
    } else if (req.url === '/eoexagency/review' || req.url === '/eoexagency/review/') {
      req.url = '/eoexagency/review.html'
    } else if (profileMatch && PROFILE_ID_SET.has(profileMatch[1])) {
      req.url = `/eoexagency/profile.html?profileId=${profileMatch[1]}`
    } else if (req.url === '/eoexagency/profiles' || req.url === '/eoexagency/profiles/') {
      req.url = '/eoexagency/profiles.html'
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
        review: path.resolve(__dirname, 'review.html'),
        profile: path.resolve(__dirname, 'profile.html'),
        profiles: path.resolve(__dirname, 'profiles.html'),
      },
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
})
