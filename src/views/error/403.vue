<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

// 返回首页
const goHome = () => {
  router.push('/index')
}

// 退出登录
const logout = () => {
  userStore.setToken('')
  router.push('/login')
}
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-icon">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#E6A23C" d="M100,15 L185,150 L15,150 Z" />
          <text x="100" y="130" text-anchor="middle" fill="#fff" font-size="40" font-weight="bold">403</text>
        </svg>
      </div>
      <h1 class="error-title">权限不足</h1>
      <p class="error-desc">抱歉，您没有权限访问此页面</p>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="logout">退出登录</el-button>
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