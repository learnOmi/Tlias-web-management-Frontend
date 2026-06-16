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
} from "element-plus";
import {
  addClazz,
  updateClazz,
  getClassById,
  getAllClazzList,
} from "@/api/clazz";
import { getEmpList } from "@/api/emp";

// Props
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "新增班级" },
  clazzData: { type: Object, default: () => ({}) },
});

// Emits
const emit = defineEmits(["update:visible", "submit-success"]);

const formRef = ref(null);

// 学科选项
const subjectOptions = [
  { label: "Java", value: 1 },
  { label: "前端开发", value: 2 },
  { label: "大数据", value: 3 },
  { label: "Python", value: 4 },
  { label: "Go", value: 5 },
  { label: "嵌入式", value: 6 },
];

// 员工列表（班主任下拉）
const empList = ref([]);

// 表单数据
const formData = ref({
  id: null,
  name: "",
  room: "",
  beginDate: "",
  endDate: "",
  masterId: "",
  subject: "",
});

// 表单校验规则
const rules = computed(() => ({
  name: [
    { required: true, message: "请输入班级名称", trigger: "blur" },
    { min: 2, max: 20, message: "班级名称长度为2-20个字符", trigger: "blur" },
  ],
  room: [{ required: true, message: "请输入班级教室", trigger: "blur" }],
  beginDate: [{ required: true, message: "请选择开课时间", trigger: "change" }],
  endDate: [{ required: true, message: "请选择结课时间", trigger: "change" }],
  masterId: [{ required: true, message: "请选择班主任", trigger: "change" }],
  subject: [{ required: true, message: "请选择学科", trigger: "change" }],
}));

// 监听 visible 变化时填充/重置表单
watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      // 加载班主任选项
      await loadEmpList();

      if (
        props.title === "修改班级" &&
        props.clazzData &&
        Object.keys(props.clazzData).length > 0
      ) {
        // 编辑模式：根据ID查询详情回填
        const detail = await getClassById(props.clazzData.id);
        const data = detail.data || props.clazzData;
        formData.value = {
          id: data.id || null,
          name: data.name || "",
          room: data.room || "",
          beginDate: data.beginDate || "",
          endDate: data.endDate || "",
          masterId: data.masterId || "",
          subject: data.subject || "",
        };
      } else {
        // 新增模式：重置表单
        formData.value = {
          id: null,
          name: "",
          room: "",
          beginDate: "",
          endDate: "",
          masterId: "",
          subject: "",
        };
      }
      // 延迟重置校验状态
      setTimeout(() => {
        formRef.value?.clearValidate();
      }, 100);
    }
  }
);

// 加载员工列表
const loadEmpList = async () => {
  const res = await getEmpList({ page: 1, pageSize: 999 });
  empList.value = res.data?.rows || [];
};

// 提交表单
const handleSubmit = async () => {
  await formRef.value.validate();

  // 准备提交数据
  const submitData = {
    ...formData.value,
    masterId: formData.value.masterId ? Number(formData.value.masterId) : null,
    subject: formData.value.subject ? Number(formData.value.subject) : null,
  };

  if (props.title === "修改班级") {
    await updateClazz(submitData);
    ElMessage.success("修改成功");
  } else {
    await addClazz(submitData);
    ElMessage.success("新增成功");
  }
  emit("submit-success");
  emit("update:visible", false);
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
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="班级名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入班级名称,2-20个字符"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班级教室" prop="room">
            <el-input v-model="formData.room" placeholder="请输入班级教室" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="开课时间" prop="beginDate">
            <el-date-picker
              v-model="formData.beginDate"
              type="date"
              placeholder="请选择开课时间"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结课时间" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="请选择结课时间"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="班主任" prop="masterId">
            <el-select
              v-model="formData.masterId"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in empList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学科" prop="subject">
            <el-select
              v-model="formData.subject"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in subjectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
