<script setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { changePwd } from "@/api/password";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const visible = ref(props.modelValue);

// 监听 props 变化同步到内部 ref
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
  }
);

// 内部 visible 变化同步回父组件
function updateVisible(val) {
  visible.value = val;
  emit("update:modelValue", val);
}

const pwdFormRef = ref(null);

const pwdForm = ref({
  oldPwd: "",
  newPwd: "",
  confirmPwd: "",
});

// 校验规则
const rules = {
  oldPwd: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPwd: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度至少为6位", trigger: "blur" },
  ],
  confirmPwd: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      validator: (_rule, value, callback) => {
        if (value !== pwdForm.value.newPwd) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 提交修改
const handleSubmit = async () => {
  if (!pwdFormRef.value) return;
  try {
    await pwdFormRef.value.validate();
  } catch {
    return;
  }
  await changePwd(pwdForm.value);
  ElMessage.success("密码修改成功");
  resetForm();
  updateVisible(false);
};

// 重置表单
const resetForm = () => {
  pwdForm.value = { oldPwd: "", newPwd: "", confirmPwd: "" };
};
</script>

<template>
  <el-dialog
    v-model="visible"
    title="修改密码"
    width="420px"
    align-center
    @close="resetForm"
  >
    <el-form
      :model="pwdForm"
      :rules="rules"
      ref="pwdFormRef"
      label-width="90px"
      size="large"
    >
      <el-form-item label="原密码" prop="oldPwd">
        <el-input
          v-model="pwdForm.oldPwd"
          type="password"
          placeholder="请输入原密码"
          show-password
          clearable
        />
      </el-form-item>

      <el-form-item label="新密码" prop="newPwd">
        <el-input
          v-model="pwdForm.newPwd"
          type="password"
          placeholder="请输入新密码"
          show-password
          clearable
        />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input
          v-model="pwdForm.confirmPwd"
          type="password"
          placeholder="请再次输入新密码"
          show-password
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button
        @click="
          updateVisible(false);
          resetForm();
        "
      >
        取 消
      </el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>
