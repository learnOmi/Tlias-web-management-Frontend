<script setup>
import { ref, watch, computed } from "vue";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElButton,
  ElMessage,
  ElDialog,
  ElUpload,
  ElIcon,
} from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import { addEmp, updateEmp, getDeptList } from "@/api/emp";

// Props
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "新增员工" },
  empData: { type: Object, default: () => ({}) },
});

// Emits
const emit = defineEmits(["update:visible", "submit-success"]);

const formRef = ref(null);

// 性别选项
const genderOptions = [
  { label: "男", value: 1 },
  { label: "女", value: 2 },
];

// 职位选项
const jobOptions = [
  { label: "班主任", value: 1 },
  { label: "讲师", value: 2 },
  { label: "学工主管", value: 3 },
  { label: "教研主管", value: 4 },
  { label: "咨询师", value: 5 },
];

// 部门列表
const deptList = ref([]);

// 表单数据（内部字段名与 API 保持一致）
const formData = ref({
  username: "",
  name: "",
  gender: "",
  phone: "",
  job: "",
  salary: "",
  image: "",
  entryDate: "",
  deptId: "",
  exprList: [],
});

// 表单校验规则（严格按照字段限制说明）
const rules = computed(() => ({
  username: [
    { required: true, message: "请输入员工用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名字数为2-20个字符", trigger: "blur" },
    { pattern: /^[a-zA-Z]+$/, message: "用户名只能输入字母", trigger: "blur" },
  ],
  name: [
    { required: true, message: "请输入员工姓名", trigger: "blur" },
    { min: 2, max: 10, message: "姓名长度为2-10个字符", trigger: "blur" },
    { pattern: /^[一-龥]+$/, message: "姓名只能输入汉字", trigger: "blur" },
  ],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  phone: [
    { required: true, message: "请输入员工手机号", trigger: "blur" },
    {
      pattern: /^\d{11}$/,
      message: "请输入正确的11位手机号码",
      trigger: "blur",
    },
  ],
  salary: [
    { pattern: /^\d+(\.\d+)?$/, message: "薪资必须为数字", trigger: "blur" },
  ],
}));

// 初始化单条工作经历（与 API 字段一致：begin/end/company/job）
const initWorkExperience = () => ({
  begin: "",
  end: "",
  company: "",
  job: "",
});

// 监听 visible 变化时填充/重置表单
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      if (
        props.title === "修改员工" &&
        props.empData &&
        Object.keys(props.empData).length > 0
      ) {
        const data = props.empData;
        formData.value = {
          username: data.username || "",
          name: data.name || "",
          gender: data.gender ?? "",
          phone: data.phone || "",
          job: data.job ?? "",
          salary: data.salary != null ? String(data.salary) : "",
          image: data.image || "",
          entryDate: data.entryDate || "",
          deptId: data.deptId || "",
          exprList:
            Array.isArray(data.exprList) && data.exprList.length > 0
              ? [...data.exprList]
              : [initWorkExperience()],
        };
      } else {
        formData.value = {
          username: "",
          name: "",
          gender: "",
          phone: "",
          job: "",
          salary: "",
          image: "",
          entryDate: "",
          deptId: "",
          exprList: [initWorkExperience()],
        };
      }
      // 延迟重置校验状态，等待表单渲染完成
      setTimeout(() => {
        formRef.value?.clearValidate();
      }, 100);
    }
  }
);

// 添加工作经历
const addWorkExperience = () => {
  formData.value.exprList.push(initWorkExperience());
};

// 删除工作经历
const removeWorkExperience = (index) => {
  if (formData.value.exprList.length > 1) {
    formData.value.exprList.splice(index, 1);
  } else {
    formData.value.exprList[0] = initWorkExperience();
  }
};

// 头像上传前校验
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过2M");
    return false;
  }
  return false; // 阻止自动上传，通过手动方式上传
};

// 头像上传成功回调
const onAvatarUploadSuccess = (response) => {
  if (response && response.code === 1) {
    formData.value.image = response.data;
    ElMessage.success("头像上传成功");
  } else {
    ElMessage.error(response?.msg || "图片过大,上传失败");
  }
};

// 提交表单
const handleSubmit = async () => {
  await formRef.value.validate();

  // 准备提交数据（与 API 字段名一致）
  const submitData = {
    ...formData.value,
    salary: formData.value.salary ? Number(formData.value.salary) : null,
    gender: formData.value.gender ? Number(formData.value.gender) : "",
  };

  if (props.title === "修改员工") {
    await updateEmp(submitData);
    ElMessage.success("修改成功");
  } else {
    await addEmp(submitData);
    ElMessage.success("新增成功");
  }
  emit("submit-success");
  emit("update:visible", false);
};

// 关闭对话框
const handleClose = () => {
  emit("update:visible", false);
};

// 加载部门列表
const loadDeptList = async () => {
  const res = await getDeptList();
  deptList.value = res.data || [];
};

loadDeptList();
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="650px"
    destroy-on-close
    @update:model-value="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="formData.username"
              placeholder="请输入员工用户名,2-20个字"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入员工姓名,2-10个字"
              maxlength="10"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select
              v-model="formData.gender"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="请输入员工手机号"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职位" prop="job">
            <el-select
              v-model="formData.job"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in jobOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资" prop="salary">
            <el-input v-model="formData.salary" placeholder="请输入员工薪资" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属部门" prop="deptId">
            <el-select
              v-model="formData.deptId"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in deptList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期" prop="entryDate">
            <el-date-picker
              v-model="formData.entryDate"
              type="date"
              placeholder="请选择入职日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="头像" prop="image">
        <el-upload
          class="avatar-uploader"
          action="/api/emp/upload"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-success="onAvatarUploadSuccess"
          :limit="1"
        >
          <img v-if="formData.image" :src="formData.image" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <span class="upload-tip">
          图片大小不超过2M<br />
          仅能上传PNG、JPEG、JPG等图片<br />
          建议上传200*200或300*300尺寸的照片
        </span>
      </el-form-item>

      <!-- 工作经历 -->
      <el-form-item label="工作经历">
        <div class="work-experience-list">
          <div
            v-for="(exp, index) in formData.exprList"
            :key="index"
            class="work-experience-item"
          >
            <div class="exp-row">
              <div class="exp-field exp-dates">
                <el-date-picker
                  v-model="exp.begin"
                  type="date"
                  placeholder="开始日期"
                  value-format="YYYY-MM-DD"
                  size="small"
                  style="width: 140px"
                />
                <span class="exp-separator">到</span>
                <el-date-picker
                  v-model="exp.end"
                  type="date"
                  placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  size="small"
                  style="width: 140px"
                />
              </div>
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="removeWorkExperience(index)"
              />
            </div>
            <div class="exp-row exp-row--info">
              <div class="exp-field">
                <el-input
                  v-model="exp.company"
                  placeholder="请输入公司的名字"
                  :maxlength="50"
                  size="small"
                />
              </div>
              <div class="exp-field">
                <el-input
                  v-model="exp.job"
                  placeholder="请输入职位"
                  :maxlength="50"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
        <el-button type="primary" size="small" @click="addWorkExperience">
          添加工作经历
        </el-button>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.upload-tip {
  display: inline-block;
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
  line-height: 1.8;
  vertical-align: top;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.work-experience-list {
  width: 100%;
}

.work-experience-item {
  padding: 14px 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fafbfc;
  margin-bottom: 12px;
  transition: box-shadow 0.2s;
}

.work-experience-item:hover {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.exp-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.exp-row--info {
  margin-top: 10px;
}

.exp-field {
  flex: 1;
}

.exp-dates {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.exp-separator {
  color: #909399;
  font-size: 13px;
  white-space: nowrap;
}
</style>
