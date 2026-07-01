import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

// 统一导出所有 store
export * from './modules/user'
export * from './modules/app'
export * from './modules/dict'