import { createApp } from 'vue'
import 'element-plus/theme-chalk/el-overlay.css' // 遮罩层样式
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './routes'
import applyMiddleware from './middleware'
const app = createApp(App)
const pinia = createPinia()
// console.warn = () => {};
applyMiddleware(router)

app.use(pinia)
app.use(router)
app.mount('#app')
