<script setup>
import { ref, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { getDeptList } from '@/api/dept'

const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增部门')
const formData = ref({
  id: null,
  name: ''
})

const getList = async () => {
  try {
    const res = await getDeptList()
    if (res.code === 1) {
      tableData.value = res.data
    } else {
      ElMessage.error(res.msg || '获取部门列表失败')
    }
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增部门'
  formData.value = { id: null, name: '' }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑部门'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('此操作将永久删除该部门, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const handleSubmit = () => {
  if (!formData.value.name.trim()) {
    ElMessage.warning('请输入部门名称')
    return
  }
  
  if (formData.value.id) {
    ElMessage.success('修改成功')
  } else {
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  getList()
}

const handleCancel = () => {
  dialogVisible.value = false
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
      <el-table-column label="操作" width="150" align="center">
        <!-- scope 是插槽参数，用于获取当前行的数据 -->
        <template #default="scope">
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
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible="dialogVisible" @close="handleCancel">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="部门名称">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
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
</style>