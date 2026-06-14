import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    ElMessage.error('请求发送失败')
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理错误
instance.interceptors.response.use(
  response => {
    const res = response.data
    // 业务成功
    if (res.code === 1) {
      return res
    }
    // 业务失败
    ElMessage.error(res.msg || '操作失败')
    return Promise.reject(new Error(res.msg || '操作失败'))
  },
  error => {
    // 网络错误或服务器错误
    let message = '网络连接异常'
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `请求失败(${status})`
      }
    } else if (error.message.includes('timeout')) {
      message = '请求超时'
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default instance