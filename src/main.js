import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { setupDirectives } from './directives/permission'
import { setupErrorHandler } from './utils/errorHandler'

import './assets/main.css'

const app = createApp(App)

// 注册 Pinia（必须在 router 之前）
app.use(pinia)
app.use(router)
app.use(ElementPlus, {locale: zhCn})

// 注册自定义指令
setupDirectives(app)

// 注册全局错误处理器
setupErrorHandler(app)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
