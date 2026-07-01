<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
      label-position="right"
    >
      <slot />
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";

interface Props {
  modelValue: boolean;
  title?: string;
  width?: string | number;
  labelWidth?: string;
  rules?: FormRules;
  initialData?: Record<string, any>;
  submitLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  width: "600px",
  labelWidth: "100px",
  rules: () => ({}),
  initialData: () => ({}),
  submitLoading: false,
});

const emit = defineEmits<{
  "update:modelValue": [val: boolean];
  submit: [formData: Record<string, any>];
}>();

const formRef = ref<FormInstance>();
const visible = ref(props.modelValue);

const formData = reactive<Record<string, any>>({ ...props.initialData });

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
    if (val) {
      resetForm();
    }
  }
);

watch(
  () => props.initialData,
  (val) => {
    Object.assign(formData, val);
  },
  { deep: true }
);

function resetForm() {
  formRef.value?.resetFields();
  Object.keys(formData).forEach((key) => {
    delete formData[key];
  });
  Object.assign(formData, props.initialData);
}

function handleClose() {
  emit("update:modelValue", false);
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit("submit", { ...formData });
    }
  });
}

defineExpose({
  formData,
  formRef,
  resetForm,
});
</script>
