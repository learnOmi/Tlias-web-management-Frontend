<template>
  <el-card shadow="never" class="page-header-card">
    <div class="page-header-content">
      <div class="header-left">
        <el-icon class="back-icon" v-if="showBack" @click="handleBack">
          <ArrowLeft />
        </el-icon>
        <div class="title-section">
          <h2 class="page-title">{{ title }}</h2>
          <p class="page-desc" v-if="description">{{ description }}</p>
        </div>
      </div>
      <div class="header-right">
        <slot name="extra" />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";

interface Props {
  title: string;
  description?: string;
  showBack?: boolean;
  backPath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false,
  backPath: "",
});

const router = useRouter();

function handleBack() {
  if (props.backPath) {
    router.push(props.backPath);
  } else {
    router.back();
  }
}
</script>

<style scoped>
.page-header-card {
  margin-bottom: 16px;
  border: none;
  border-bottom: 1px solid #ebeef5;
  border-radius: 0;
}
.page-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.back-icon {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.3s;
}
.back-icon:hover {
  color: #409eff;
}
.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
.page-desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: #909399;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
