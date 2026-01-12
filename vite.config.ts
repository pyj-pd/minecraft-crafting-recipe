import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import UnheadVite from '@unhead/addons/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), UnheadVite()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@shared': path.resolve(import.meta.dirname, './shared'),
      '@public': path.resolve(import.meta.dirname, './public'),
    },
  },
})
