<script setup>
import { ref, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { getDeptList, getDeptById, addDept, updateDept, deleteDept } from '@/api/dept'

const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增部门')
const formRef = ref(null)
const formData = ref({
  id: null,
  name: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称长度为2-10个字符', trigger: 'blur' }
  ]
}

// 查询部门列表
const getList = async () => {
  const res = await getDeptList()
  tableData.value = res.data
}

// 新增部门
const handleAdd = () => {
  dialogTitle.value = '新增部门'
  formData.value = { id: null, name: '' }
  dialogVisible.value = true
  // 重置表单校验状态
  formRef.value?.resetFields()
}

// 编辑部门 - 根据ID查询详情
const handleEdit = async (row) => {
  const res = await getDeptById(row.id)
  dialogTitle.value = '编辑部门'
  formData.value = { ...res.data }
  dialogVisible.value = true
  // 重置表单校验状态
  formRef.value?.resetFields()
}

// 删除部门
const handleDelete = (row) => {
  ElMessageBox.confirm('此操作将永久删除该部门, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      await deleteDept(row.id)
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {
      // 用户取消删除，不做处理
    })
}

// 提交表单 - 新增或修改
const handleSubmit = async () => {
  // 表单校验
  const valid = await formRef.value?.validate()
  if (!valid) return

  if (formData.value.id) {
    // 修改
    await updateDept({ id: formData.value.id, name: formData.value.name })
    ElMessage.success('修改成功')
  } else {
    // 新增
    await addDept({ name: formData.value.name })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  getList()
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="dept-container">
    <div class="header">
      <h2>部门管理</h2>
      <el-button type="primary" icon="Plus" @click="handleAdd">
        新增部门
      </el-button>
    </div>

    <el-table :data="tableData" border>
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="部门名称" prop="name" />
      <el-table-column label="最后操作时间" prop="updateTime" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <div class="action-buttons">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.dept-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>