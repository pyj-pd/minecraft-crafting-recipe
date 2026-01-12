import '@/assets/styles/global.scss'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'

const app = createApp(App)

// Unhead
const head = createHead()
app.use(head)

// Pinia
const pinia = createPinia()
app.use(pinia)

app.mount('#app')
