import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seoPages } from './build/seo.ts'

/**
 * Content-Security-Policy for the built site: scripts only from this site and Cloudflare
 * Turnstile, data only to our API and the map search, so an injected script has nowhere
 * to load from or send to. Build only, because the dev server relies on inline scripts.
 * frame-ancestors can't go in a <meta> tag; it's set as a header on the host.
 */
function contentSecurityPolicy(apiBaseUrl: string): Plugin {
  const apiOrigin = new URL(apiBaseUrl).origin
  const policy = [
    "default-src 'self'",
    "script-src 'self' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    // Inline style attributes come from animations and the map; they can't run code.
    "style-src 'self' 'unsafe-inline'",
    // Product photos and map tiles come from several hosts.
    `img-src 'self' data: blob: https: ${apiOrigin}`,
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigin} https://nominatim.openstreetmap.org`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: policy }, injectTo: 'head-prepend' },
    ],
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [
      react(),
      tailwindcss(),
      contentSecurityPolicy(env.VITE_API_BASE_URL),
      seoPages({ apiBaseUrl: env.VITE_API_BASE_URL }),
    ],
    build: {
      // No source maps in production: they'd publish the original source code.
      sourcemap: false,
      rolldownOptions: {
        output: {
          // Libraries in their own files: they change rarely, so browsers keep them cached
          // across deploys and download them in parallel with the app code.
          codeSplitting: {
            groups: [
              { name: 'vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'routing', test: /node_modules[\\/](react-router|react-router-dom)[\\/]/ },
              // framer-motion is left to split by itself, so its animation engine stays lazy-loaded.
            ],
          },
        },
      },
    },
    server: {
      port: 5173,
    },
  }
})
