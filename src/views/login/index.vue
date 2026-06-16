<script setup>
import { User, Lock } from "@element-plus/icons-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { login } from "@/api/login";

const router = useRouter();

const loginFormRef = ref(null);
const isShaking = ref(false);

const loginForm = ref({ username: "", password: "" });

// 表单校验规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
  ],
};

// 登录
const handleLogin = async () => {
  // 触发表单校验
  if (!loginFormRef.value) return;
  try {
    await loginFormRef.value.validate();
  } catch {
    // 校验失败：抖动动画
    isShaking.value = true;
    setTimeout(() => {
      isShaking.value = false;
    }, 600);
    return;
  }
  const res = await login(loginForm.value);
  ElMessage.success("登录成功");
  localStorage.setItem("token", res.data.token);
  router.push("/index");
};

// 重置表单
const handleReset = () => {
  loginForm.value = { username: "", password: "" };
};
</script>

<template>
  <div class="login-wrapper">
    <!-- 动态背景 -->
    <div class="bg-layer">
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>
    </div>

    <div class="login-card">
      <!-- 左侧品牌区 -->
      <div class="brand-panel">
        <div class="brand-content">
          <div class="brand-logo">
            <svg viewBox="0 0 64 64" class="logo-svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop
                    offset="0%"
                    style="stop-color: #ffffff; stop-opacity: 1"
                  />
                  <stop
                    offset="100%"
                    style="stop-color: #e0f0ff; stop-opacity: 1"
                  />
                </linearGradient>
              </defs>
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#grad1)"
                stroke-width="2"
              />
              <path
                d="M20 28 L32 18 L44 28 L44 40 L32 50 L20 40Z"
                fill="none"
                stroke="url(#grad1)"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M28 28 L32 24 L36 28 L36 36 L32 40 L28 36Z"
                fill="url(#grad1)"
                opacity="0.6"
              />
            </svg>
          </div>
          <h1 class="brand-title">Tlias</h1>
          <p class="brand-subtitle">智能学习辅助系统</p>
          <div class="brand-divider"></div>
          <p class="brand-desc">Efficient Learning, Intelligent Management</p>
        </div>
        <!-- 装饰几何图形 -->
        <div class="geo geo-1"></div>
        <div class="geo geo-2"></div>
        <div class="geo geo-3"></div>
      </div>

      <!-- 右侧表单区 -->
      <div class="form-panel">
        <div class="form-inner">
          <div class="form-header fade-in">
            <h2 class="form-title">欢迎回来</h2>
            <p class="form-desc">请登录您的账号以继续</p>
          </div>

          <el-form
            :model="loginForm"
            :rules="rules"
            ref="loginFormRef"
            label-width="0"
            size="large"
            @keyup.enter="handleLogin"
            :class="{ 'form-shake': isShaking }"
          >
            <el-form-item prop="username">
              <div class="input-wrapper">
                <el-icon class="field-icon"><User /></el-icon>
                <el-input
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  clearable
                  tabindex="1"
                />
              </div>
            </el-form-item>

            <el-form-item prop="password">
              <div class="input-wrapper">
                <el-icon class="field-icon"><Lock /></el-icon>
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  clearable
                  tabindex="2"
                />
              </div>
            </el-form-item>

            <div class="btn-row">
              <el-button
                class="login-btn"
                type="primary"
                @click="handleLogin"
                tabindex="3"
              >
                登 录
              </el-button>

              <el-button class="reset-btn" @click="handleReset" tabindex="4">
                重 置
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== 整体布局 ========== */
.login-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0f172a;
}

/* ========== 动态背景 ========== */
.bg-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #6366f1, #4f46e5);
  top: -15%;
  right: -10%;
  animation: orb-float-1 8s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #06b6d4, #0891b2);
  bottom: -20%;
  left: -5%;
  animation: orb-float-2 10s ease-in-out infinite;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #8b5cf6, #7c3aed);
  top: 40%;
  left: 40%;
  animation: orb-float-3 12s ease-in-out infinite;
}

@keyframes orb-float-1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-40px, 30px) scale(1.1);
  }
}

@keyframes orb-float-2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -40px) scale(1.05);
  }
}

@keyframes orb-float-3 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-20px, -20px) scale(1.15);
  }
}

/* ========== 卡片容器 ========== */
.login-card {
  width: 900px;
  height: 540px;
  display: flex;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* ========== 左侧品牌区 ========== */
.brand-panel {
  width: 360px;
  background: linear-gradient(160deg, #4f46e5 0%, #6366f1 40%, #818cf8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  padding: 32px;
}

.brand-logo {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  animation: logo-spin 20s linear infinite;
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.logo-svg {
  width: 100%;
  height: 100%;
}

.brand-title {
  font-size: 40px;
  font-weight: 800;
  margin: 0;
  letter-spacing: 4px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.brand-subtitle {
  font-size: 14px;
  margin: 10px 0 0;
  opacity: 0.85;
  letter-spacing: 2px;
}

.brand-divider {
  width: 48px;
  height: 3px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
  margin: 20px auto 16px;
}

.brand-desc {
  font-size: 12px;
  opacity: 0.6;
  letter-spacing: 1px;
  margin: 0;
}

/* 装饰几何图形 */
.geo {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
}

.geo-1 {
  width: 200px;
  height: 200px;
  top: -60px;
  right: -60px;
  animation: geo-rotate 25s linear infinite;
}

.geo-2 {
  width: 140px;
  height: 140px;
  bottom: -40px;
  left: -40px;
  animation: geo-rotate 20s linear infinite reverse;
}

.geo-3 {
  width: 80px;
  height: 80px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: geo-pulse 4s ease-in-out infinite;
}

@keyframes geo-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes geo-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.1;
  }
}

/* ========== 右侧表单区 ========== */
.form-panel {
  flex: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
}

.form-inner {
  width: 100%;
  max-width: 300px;
}

.fade-in {
  animation: fadeIn 0.5s ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px;
}

.form-desc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

/* ========== 表单抖动动画 ========== */
.form-shake {
  animation: formShake 0.6s ease;
}

@keyframes formShake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-6px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(6px);
  }
}

/* ========== 输入框样式 ========== */
.input-wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 14px;
  transition: all 0.25s ease;
  background: #f8fafc;
  width: 100%;
}

.input-wrapper:focus-within {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* 覆盖 Element Plus 校验失败的红色方框 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  background: transparent;
  padding: 6px 0;
  border-radius: 0;
}

:deep(.el-input__inner) {
  font-size: 14px;
  font-weight: 500;
}

/* 校验失败：仅边框泛红，去掉红色背景 */
:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: none !important;
  background: transparent !important;
  border-color: transparent !important;
}

:deep(.el-form-item.is-error .input-wrapper) {
  border-color: #ef4444;
}

:deep(.el-form-item.is-error .field-icon) {
  color: #ef4444;
}

:deep(.el-form-item__error) {
  padding-top: 4px;
  padding-bottom: 0;
  font-size: 12px;
  line-height: 1;
}

.field-icon {
  font-size: 18px;
  color: #94a3b8;
  margin-right: 10px;
  flex-shrink: 0;
  transition: color 0.25s ease;
}

.input-wrapper:focus-within .field-icon {
  color: #6366f1;
}

/* ========== 按钮样式 ========== */
.btn-row {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.login-btn {
  flex: 1;
  height: 46px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 6px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.45);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.reset-btn {
  flex: 1;
  height: 46px;
  border-radius: 10px;
  font-size: 15px;
  border: 1.5px solid #e2e8f0;
  color: #64748b;
  background: #f8fafc;
  transition: all 0.25s ease;
}

.reset-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
  background: #eef2ff;
}

/* ========== 响应式 ========== */
@media (max-width: 960px) {
  .login-card {
    width: 92%;
    height: auto;
    flex-direction: column;
  }

  .brand-panel {
    width: 100%;
    height: 180px;
  }

  .form-panel {
    padding: 36px 24px;
  }

  .brand-logo {
    width: 52px;
    height: 52px;
  }

  .brand-title {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .login-card {
    border-radius: 16px;
  }

  .brand-panel {
    height: 150px;
  }

  .form-panel {
    padding: 28px 20px;
  }
}
</style>
