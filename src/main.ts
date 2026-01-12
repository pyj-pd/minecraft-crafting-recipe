import '@/assets/styles/global.scss'
import App from './App.vue'
import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg/single-page'

export const createApp = ViteSSG(App, async ({ app }) => {
  // Pinia
  const pinia = createPinia()
  app.use(pinia)
})
