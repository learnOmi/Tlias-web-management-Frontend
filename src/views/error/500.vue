<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 刷新页面
const refresh = () => {
  window.location.reload()
}

// 返回首页
const goHome = () => {
  router.push('/index')
}
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-icon">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="160" height="160" rx="20" fill="#909399" />
          <text x="100" y="115" text-anchor="middle" fill="#fff" font-size="40" font-weight="bold">500</text>
        </svg>
      </div>
      <h1 class="error-title">服务器错误</h1>
      <p class="error-desc">抱歉，服务器出现异常，请稍后重试</p>
      <div class="error-actions">
        <el-button type="primary" @click="refresh">刷新页面</el-button>
        <el-button @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.error-content {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.error-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

.error-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 15px;
}

.error-desc {
  font-size: 16px;
  color: #606266;
  margin: 0 0 40px;
}

.error-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>