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
    port: 33720,
  },
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    lib: {
      entry: path.join(filePath, 'src', 'index.ts'),
      name: 'index',
      formats: ['es'],
      fileName: 'index',
    },
    outDir: path.join(filePath, 'dist'),
    cssCodeSplit: false,
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
      ],
      output: {
        advancedChunks: {
          groups: [
            {
              name: 'vendor-react',
              test: (moduleId) => {
                return (
                  moduleId.includes('react') || moduleId.includes('react-dom')
                )
              },
              priority: 1,
            },
            {
              name: 'vendor-ui',
              test: (moduleId) => {
                return (
                  moduleId.includes('@heroui/react') ||
                  moduleId.includes('@heroui/styles')
                )
              },
              priority: 2,
            },
            {
              name: 'ui-utils',
              test: (moduleId) => {
                return (
                  moduleId.includes('tailwindcss') ||
                  moduleId.includes('lucide-react') ||
                  moduleId.includes('react-icons') ||
                  moduleId.includes('clsx')
                )
              },
              priority: 3,
            },
            {
              name: 'components',
              test: (moduleId) => {
                return moduleId.includes('src/components/')
              },
              priority: 4,
            },
          ],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'index') {
            return 'index.js'
          }
          return 'assets/js/entry-[hash].js'
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || ''
          const extType = info.split('.').pop() || 'misc'
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(info)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(info)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          return `assets/${extType}/[name]-[hash][extname]`
        },
      },
    },
  },
})
