import { createApp } from 'vue'
import 'element-plus/theme-chalk/el-overlay.css' // 遮罩层样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import { createPinia } from 'pinia'
import '@/assets/styles/main.scss'
import { IonicVue } from '@ionic/vue'
import App from './App.vue'
import { router } from './routes'
import applyMiddleware from './middleware'

const app = createApp(App)
const pinia = createPinia()

applyMiddleware(router)
app.use(pinia)
app.use(router)
app.use(IonicVue)

router.isReady().then(() => {
  app.mount('#app')
})
