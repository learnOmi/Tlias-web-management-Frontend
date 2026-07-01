import { useUserStore } from '@/stores'

/**
 * 权限指令 v-permission
 * 使用方式：
 *   v-permission="'system:emp:add'"      - 单个权限
 *   v-permission="['system:emp:add', 'system:emp:edit']" - 多个权限（满足任意一个）
 *
 * 无权限时，元素会被移除
 */
export const permission = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const value = binding.value

    if (!value) {
      console.warn('[v-permission] 未传入权限标识')
      return
    }

    // 检查权限
    const hasPermission = userStore.hasPermission(value)

    if (!hasPermission) {
      // 无权限，移除元素
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 角色指令 v-role
 * 使用方式：
 *   v-role="'admin'"      - 单个角色
 *   v-role="['admin', 'teacher']" - 多个角色（满足任意一个）
 */
export const role = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const value = binding.value

    if (!value) {
      console.warn('[v-role] 未传入角色标识')
      return
    }

    const hasRole = userStore.hasRole(value)

    if (!hasRole) {
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 注册所有自定义指令
 * @param {object} app - Vue 应用实例
 */
export const setupDirectives = (app) => {
  app.directive('permission', permission)
  app.directive('role', role)
}