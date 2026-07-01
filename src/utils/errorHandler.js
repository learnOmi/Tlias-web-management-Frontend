import { ElMessage } from 'element-plus'

/**
 * 错误类型枚举
 */
const ErrorType = {
  VUE: 'vue',
  RESOURCE: 'resource',
  PROMISE: 'promise',
  NETWORK: 'network',
  JS: 'js'
}

/**
 * 错误上报配置
 */
const REPORT_CONFIG = {
  enabled: true, // 是否开启上报
  apiUrl: '/api/log/report', // 上报接口地址
  throttleTime: 5000 // 上报间隔（毫秒），避免频繁上报
}

// 上报队列
const reportQueue = []

// 上报定时器
let reportTimer = null

/**
 * 格式化错误信息
 * @param {object} error
 * @returns {object}
 */
const formatError = (error) => {
  return {
    message: error.message || '',
    stack: error.stack || '',
    name: error.name || 'Error'
  }
}

/**
 * 上报错误（带节流）
 * @param {object} errorData
 */
const reportError = (errorData) => {
  if (!REPORT_CONFIG.enabled) {
    return
  }

  // 添加到队列
  reportQueue.push({
    ...errorData,
    timestamp: Date.now()
  })

  // 设置定时器，批量上报
  if (reportTimer) {
    return
  }

  reportTimer = setTimeout(() => {
    // TODO: 对接后端上报接口
    // 这里暂时只在开发环境输出
    if (import.meta.env.DEV) {
      console.group('[错误上报]')
      reportQueue.forEach((item) => {
        console.log(`[${item.type}] ${item.message}`)
        if (item.stack) {
          console.log(item.stack)
        }
      })
      console.groupEnd()
    }

    // 清空队列
    reportQueue.length = 0
    reportTimer = null
  }, REPORT_CONFIG.throttleTime)
}

/**
 * 处理 Vue 组件错误
 * @param {Error} error
 * @param {object} instance
 * @param {string} info
 */
export const handleVueError = (error, instance, info) => {
  const errorData = {
    type: ErrorType.VUE,
    ...formatError(error),
    componentName: instance?.$options?.name || 'Anonymous',
    info,
    url: window.location.href
  }

  // 开发环境打印详细错误
  if (import.meta.env.DEV) {
    console.group('[Vue Error]')
    console.error(error)
    console.log('Component:', errorData.componentName)
    console.log('Info:', info)
    console.groupEnd()
  }

  // 上报错误
  reportError(errorData)

  // 显示友好提示
  ElMessage.error('页面出现异常，请刷新页面重试')
}

/**
 * 处理资源加载错误
 * @param {Event} event
 */
export const handleResourceError = (event) => {
  const target = event.target || event.srcElement
  const errorData = {
    type: ErrorType.RESOURCE,
    message: `资源加载失败: ${target.src || target.href}`,
    tagName: target.tagName,
    url: window.location.href
  }

  if (import.meta.env.DEV) {
    console.log('[Resource Error]', errorData.message)
  }

  reportError(errorData)
}

/**
 * 处理 Promise 未捕获错误
 * @param {Event} event
 */
export const handlePromiseError = (event) => {
  event.preventDefault()

  const error = event.reason
  const errorData = {
    type: ErrorType.PROMISE,
    ...formatError(error),
    url: window.location.href
  }

  if (import.meta.env.DEV) {
    console.group('[Promise Error]')
    console.error(error)
    console.groupEnd()
  }

  reportError(errorData)
}

/**
 * 处理全局 JS 错误
 * @param {Event} event
 */
export const handleGlobalError = (event) => {
  const error = event.error
  const errorData = {
    type: ErrorType.JS,
    ...formatError(error),
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    url: window.location.href
  }

  if (import.meta.env.DEV) {
    console.group('[Global Error]')
    console.error(error)
    console.log('File:', event.filename, 'Line:', event.lineno)
    console.groupEnd()
  }

  reportError(errorData)
}

/**
 * 注册全局错误处理器
 */
export const setupErrorHandler = (app) => {
  // Vue 组件错误
  app.config.errorHandler = handleVueError

  // Vue 组件警告（开发环境）
  if (import.meta.env.DEV) {
    app.config.warnHandler = (msg, instance, trace) => {
      console.warn('[Vue Warn]', msg)
      console.log('Trace:', trace)
    }
  }

  // 全局 JS 错误
  window.addEventListener('error', handleGlobalError, true)

  // 资源加载错误（img, script, link 等）
  window.addEventListener('error', handleResourceError, true)

  // Promise 未捕获错误
  window.addEventListener('unhandledrejection', handlePromiseError, true)
}