<script setup>
import { ref, onErrorCaptured } from 'vue'

const props = defineProps({
  // 自定义错误提示
  errorMessage: {
    type: String,
    default: '页面出现异常'
  },
  // 是否显示重试按钮
  showRetry: {
    type: Boolean,
    default: true
  },
  // 是否显示详情（开发环境）
  showDetail: {
    type: Boolean,
    default: import.meta.env.DEV
  }
})

const emit = defineEmits(['error'])

// 是否有错误
const hasError = ref(false)

// 错误信息
const errorInfo = ref({
  message: '',
  stack: ''
})

// 捕获子组件错误
onErrorCaptured((error, instance, info) => {
  hasError.value = true
  errorInfo.value = {
    message: error.message,
    stack: error.stack,
    component: instance?.$options?.name || 'Anonymous',
    info
  }

  // 上报错误
  emit('error', errorInfo.value)

  // 返回 false 阻止错误继续向上传播
  return false
})

// 重试
const handleRetry = () => {
  hasError.value = false
  errorInfo.value = { message: '', stack: '' }
}

// 刷新页面
const handleRefresh = () => {
  window.location.reload()
}
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary-content">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#E6A23C" stroke-width="2" />
          <path d="M12 8V12" stroke="#E6A23C" stroke-width="2" stroke-linecap="round" />
          <circle cx="12" cy="16" r="1" fill="#E6A23C" />
        </svg>
      </div>
      <h3 class="error-title">{{ errorMessage }}</h3>
      <p class="error-desc">请尝试刷新页面或联系管理员</p>

      <!-- 开发环境显示详细错误 -->
      <div v-if="showDetail && errorInfo.stack" class="error-detail">
        <pre>{{ errorInfo.message }}</pre>
        <details>
          <summary>查看详细信息</summary>
          <pre>{{ errorInfo.stack }}</pre>
        </details>
      </div>

      <div class="error-actions">
        <el-button v-if="showRetry" type="primary" @click="handleRetry">
          重试
        </el-button>
        <el-button @click="handleRefresh">
          刷新页面
        </el-button>
      </div>
    </div>
  </div>

  <!-- 正常渲染子组件 -->
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.error-boundary-content {
  text-align: center;
  max-width: 400px;
}

.error-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

.error-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px;
}

.error-desc {
  font-size: 14px;
  color: #606266;
  margin: 0 0 30px;
}

.error-detail {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: left;
}

.error-detail pre {
  font-size: 12px;
  color: #909399;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-detail details {
  margin-top: 10px;
}

.error-detail summary {
  cursor: pointer;
  color: #409EFF;
  font-size: 12px;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}
</style>