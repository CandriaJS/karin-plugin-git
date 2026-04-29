import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { builtinModules } from 'node:module'
import tailwindcss from '@tailwindcss/vite'

const filePath = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    port: 33710,
  },
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    target: 'es2022',
    outDir: path.join(filePath, 'dist'),
    cssCodeSplit: false,
    chunkSizeWarningLimit: 1000,
    lib: {
      entry: path.join(filePath, 'src', 'index.ts'),
      formats: ['es'],
      cssFileName: 'main',
    },
    rolldownOptions: {
      external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],

      output: {
        inlineDynamicImports: false,
        advancedChunks: {
          groups: [
            {
              name: 'vendor-react',
              test: (moduleId) => {
                return (
                  moduleId.includes('node_modules/react/') ||
                  moduleId.includes('react-dom')
                )
              },
            },
            {
              name: 'ui-utils',
              test: (moduleId) => {
                return (
                  moduleId.includes('tailwindcss') ||
                  moduleId.includes('react-icons') ||
                  moduleId.includes('dayjs')
                )
              },
            },
            {
              name: 'components',
              test: (moduleId) => {
                return moduleId.includes('components/')
              },
            },
          ],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'index'
            ? 'index.js'
            : 'assets/js/[name]-[hash].js'
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || ''
          const extType = info.split('.').pop() || 'misc'
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(info)) {
            return 'assets/images/[name][extname]'
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(info)) {
            return 'assets/fonts/[name][extname]'
          }
          return `assets/${extType}/[name][extname]`
        },
      },
    },
  },
})
