<template>
  <el-upload
    :action="uploadUrl"
    :headers="uploadHeaders"
    :show-file-list="false"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    accept="image/*"
  >
    <div v-if="modelValue" class="image-preview">
      <img :src="modelValue" :alt="alt" />
      <div class="image-mask">
        <el-icon><Edit /></el-icon>
      </div>
    </div>
    <div v-else class="image-placeholder">
      <el-icon><Plus /></el-icon>
      <span>{{ placeholder }}</span>
    </div>
  </el-upload>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Plus, Edit } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";

interface Props {
  modelValue: string;
  alt?: string;
  placeholder?: string;
  maxSize?: number;
  width?: number | string;
  height?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  alt: "",
  placeholder: "上传图片",
  maxSize: 2,
  width: 100,
  height: 100,
});

const emit = defineEmits<{
  "update:modelValue": [val: string];
  change: [url: string];
}>();

const userStore = useUserStore();

const uploadUrl = computed(() => "/api/upload");

const uploadHeaders = computed(() => ({
  token: userStore.token || "",
}));

function beforeUpload(file: File) {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  const isLtMax = file.size / 1024 / 1024 < props.maxSize;
  if (!isLtMax) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB!`);
    return false;
  }
  return true;
}

function handleSuccess(response: any) {
  if (response.code === 1) {
    emit("update:modelValue", response.data);
    emit("change", response.data);
    ElMessage.success("上传成功");
  } else {
    ElMessage.error(response.msg || "上传失败");
  }
}

function handleError() {
  ElMessage.error("上传失败，请稍后重试");
}
</script>

<style scoped>
.image-preview,
.image-placeholder {
  width: v-bind(width + "px");
  height: v-bind(height + "px");
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: border-color 0.3s;
}
.image-preview:hover,
.image-placeholder:hover {
  border-color: #409eff;
}
.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.image-preview:hover .image-mask {
  opacity: 1;
}
.image-placeholder {
  flex-direction: column;
  color: #8c939d;
  font-size: 12px;
  gap: 4px;
}
</style>
