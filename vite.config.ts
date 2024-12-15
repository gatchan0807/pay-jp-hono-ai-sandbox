import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      esbuild: {
        jsxImportSource: 'hono/jsx/dom' // Optimized for hono/jsx/dom
      },
      build: {
        rollupOptions: {
          input: './src/clients/page/ai.tsx',
          output: {
            entryFileNames: 'static/ai/limited.js'
          }
        }
      }
    }
  } else {
    return {
      plugins: [
        pages(),
        devServer({
          adapter,
          entry: 'src/index.tsx'
        })
      ]
    }
  }
})