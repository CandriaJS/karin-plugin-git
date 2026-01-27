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
      external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
      output: {
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
            {
              name: 'utils',
              test: (moduleId) => {
                return moduleId.includes('utils/')
              },
            },
          ],
        },
      },
    },
  },
})
