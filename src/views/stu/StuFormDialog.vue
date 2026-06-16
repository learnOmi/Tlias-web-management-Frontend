<script setup>
import { ref, watch, computed } from "vue";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElSwitch,
  ElButton,
  ElMessage,
  ElDialog,
} from "element-plus";
import {
  addStudent,
  updateStudent,
  getStudentById,
  getAllClazzList,
} from "@/api/student";

// Props
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "新增学员" },
  studentData: { type: Object, default: () => ({}) },
});

// Emits
const emit = defineEmits(["update:visible", "submit-success"]);

const formRef = ref(null);

// 班级选项
const clazzOptions = ref([]);

// 学历选项
const degreeOptions = [
  { label: "初中", value: 1 },
  { label: "高中", value: 2 },
  { label: "大专", value: 3 },
  { label: "本科", value: 4 },
  { label: "硕士", value: 5 },
  { label: "博士", value: 6 },
];

// 性别选项
const genderOptions = [
  { label: "男", value: 1 },
  { label: "女", value: 2 },
];

// 表单数据
const formData = ref({
  id: null,
  name: "",
  no: "",
  gender: "",
  phone: "",
  degree: "",
  clazzId: "",
  idCard: "",
  isCollege: 0,
  address: "",
  graduationDate: "",
});

// 表单校验规则
const rules = computed(() => ({
  name: [
    { required: true, message: "请输入学员姓名", trigger: "blur" },
    { min: 2, max: 20, message: "姓名长度为2-20个字符", trigger: "blur" },
  ],
  no: [{ required: true, message: "请输入学号", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  phone: [
    { required: true, message: "请输入学员手机号", trigger: "blur" },
    {
      pattern: /^\d{11}$/,
      message: "请输入正确的11位手机号码",
      trigger: "blur",
    },
  ],
  degree: [{ required: true, message: "请选择学历", trigger: "change" }],
  clazzId: [{ required: true, message: "请选择班级", trigger: "change" }],
}));

// 监听 visible 变化时填充/重置表单
watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      // 加载班级选项
      await loadClazzList();

      if (
        props.title === "修改学员" &&
        props.studentData &&
        Object.keys(props.studentData).length > 0
      ) {
        // 编辑模式：根据ID查询详情回填
        const detail = await getStudentById(props.studentData.id);
        const data = detail.data || props.studentData;
        formData.value = {
          id: data.id || null,
          name: data.name || "",
          no: data.no || "",
          gender: data.gender ?? "",
          phone: data.phone || "",
          degree: data.degree ?? "",
          clazzId: data.clazzId || "",
          idCard: data.idCard || "",
          isCollege: data.isCollege ?? 0,
          address: data.address || "",
          graduationDate: data.graduationDate || "",
        };
      } else {
        // 新增模式：重置表单
        formData.value = {
          id: null,
          name: "",
          no: "",
          gender: "",
          phone: "",
          degree: "",
          clazzId: "",
          idCard: "",
          isCollege: 0,
          address: "",
          graduationDate: "",
        };
      }
      // 延迟重置校验状态
      setTimeout(() => {
        formRef.value?.clearValidate();
      }, 100);
    }
  }
);

// 加载班级列表
const loadClazzList = async () => {
  const res = await getAllClazzList();
  clazzOptions.value = res.data || [];
};

// 提交表单
const handleSubmit = async () => {
  await formRef.value.validate();

  // 准备提交数据
  const submitData = {
    ...formData.value,
    gender: formData.value.gender ? Number(formData.value.gender) : "",
    degree: formData.value.degree ? Number(formData.value.degree) : "",
    clazzId: formData.value.clazzId ? Number(formData.value.clazzId) : "",
    isCollege: formData.value.isCollege ? Number(formData.value.isCollege) : 0,
  };

  try {
    if (props.title === "修改学员") {
      await updateStudent(submitData);
      ElMessage.success("修改成功");
    } else {
      await addStudent(submitData);
      ElMessage.success("新增成功");
    }
    emit("submit-success");
    emit("update:visible", false);
  } catch {
    // 响应拦截器已统一处理错误提示
  }
};

// 关闭对话框
const handleClose = () => {
  emit("update:visible", false);
};
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="650px"
    destroy-on-close
    @update:model-value="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="学员姓名" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入学员姓名,2-20个字符"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号" prop="no">
            <el-input v-model="formData.no" placeholder="请输入学号" />
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
              placeholder="请输入学员手机号"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="学历" prop="degree">
            <el-select
              v-model="formData.degree"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in degreeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班级" prop="clazzId">
            <el-select
              v-model="formData.clazzId"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in clazzOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="毕业时间" prop="graduationDate">
            <el-date-picker
              v-model="formData.graduationDate"
              type="date"
              placeholder="请选择毕业时间"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否院校学生" prop="isCollege">
            <el-switch
              v-model="formData.isCollege"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="formData.address" placeholder="请输入联系地址" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
