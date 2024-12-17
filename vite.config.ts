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
          input: {
            ai: './src/csr/page/ai.tsx',
            another: './src/csr/page/ai-premium.tsx'
          },
          output: {
            entryFileNames: (chunkInfo) => {
              if (chunkInfo.name === 'ai') {
                return 'static/ai/limited.js'
              } else if (chunkInfo.name === 'ai-premium') {
                return 'static/ai/premium.js'
              }
              return 'static/[name]/limited.js'
            }
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