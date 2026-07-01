import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

/**
 * 用户状态管理 Store
 * 管理 Token、用户信息、角色、权限等
 */
export const useUserStore = defineStore('user', () => {
  // ========== State ==========

  // Token
  const token = ref('')

  // 用户基本信息
  const userInfo = ref({
    id: null,
    username: '',
    name: '',
    avatar: ''
  })

  // 角色列表
  const roles = ref([])

  // 权限列表
  const permissions = ref([])

  // ========== Computed ==========

  // 是否已登录
  const isLoggedIn = computed(() => !!token.value)

  // 是否是管理员
  const isAdmin = computed(() => roles.value.includes('admin'))

  // 用户显示名称
  const displayName = computed(() => userInfo.value.name || userInfo.value.username || '未知用户')

  // ========== Actions ==========

  /**
   * 设置 Token
   * @param {string} newToken
   */
  const setToken = (newToken) => {
    token.value = newToken
  }

  /**
   * 设置用户信息
   * @param {object} info
   */
  const setUserInfo = (info) => {
    userInfo.value = {
      id: info.id || null,
      username: info.username || '',
      name: info.name || '',
      avatar: info.avatar || ''
    }
  }

  /**
   * 设置角色
   * @param {string[]} newRoles
   */
  const setRoles = (newRoles) => {
    roles.value = newRoles || []
  }

  /**
   * 设置权限
   * @param {string[]} newPermissions
   */
  const setPermissions = (newPermissions) => {
    permissions.value = newPermissions || []
  }

  /**
   * 登录成功后设置所有用户数据
   * @param {object} data - 登录接口返回的数据
   */
  const setLoginData = (data) => {
    setToken(data.token)
    if (data.userInfo) {
      setUserInfo(data.userInfo)
    }
    if (data.roles) {
      setRoles(data.roles)
    }
    if (data.permissions) {
      setPermissions(data.permissions)
    }
  }

  /**
   * 检查是否有指定权限
   * @param {string|string[]} permission - 权限标识或权限标识数组
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    // 管理员拥有所有权限
    if (isAdmin.value) {
      return true
    }

    // 权限列表为空，默认无权限
    if (!permissions.value.length) {
      return false
    }

    // 支持数组形式（满足其中任意一个即可）
    if (Array.isArray(permission)) {
      return permission.some(p => permissions.value.includes(p))
    }

    // 单个权限检查
    return permissions.value.includes(permission)
  }

  /**
   * 检查是否有指定角色
   * @param {string|string[]} role - 角色标识或角色标识数组
   * @returns {boolean}
   */
  const hasRole = (role) => {
    if (!roles.value.length) {
      return false
    }

    // 支持数组形式（满足其中任意一个即可）
    if (Array.isArray(role)) {
      return role.some(r => roles.value.includes(r))
    }

    return roles.value.includes(role)
  }

  /**
   * 退出登录
   * 清除所有用户数据，跳转到登录页
   */
  const logout = async () => {
    // 清除数据
    token.value = ''
    userInfo.value = { id: null, username: '', name: '', avatar: '' }
    roles.value = []
    permissions.value = []

    // 提示用户
    ElMessage.success('已退出登录')

    // 跳转到登录页
    const router = useRouter()
    router.push('/login')
  }

  /**
   * 清除用户数据（不跳转）
   * 用于 Token 过期等场景
   */
  const clearUserData = () => {
    token.value = ''
    userInfo.value = { id: null, username: '', name: '', avatar: '' }
    roles.value = []
    permissions.value = []
  }

  return {
    // State
    token,
    userInfo,
    roles,
    permissions,

    // Computed
    isLoggedIn,
    isAdmin,
    displayName,

    // Actions
    setToken,
    setUserInfo,
    setRoles,
    setPermissions,
    setLoginData,
    hasPermission,
    hasRole,
    logout,
    clearUserData
  }
}, {
  // 持久化配置
  persist: {
    key: 'tlias-user',
    storage: localStorage,
    paths: ['token', 'userInfo', 'roles', 'permissions']
  }
})