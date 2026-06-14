<script setup>
import { ref, watch } from 'vue'
import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton, ElForm, ElFormItem } from 'element-plus'

// 搜索条件
const searchForm = ref({
  name: '',
  gender: '',
  dateRange:[],
  begin: '',
  end: ''
})

// 监听dateRange变化
watch(() => searchForm.value.dateRange, (newValue) => {
  if (newValue && newValue.length === 2) {
    searchForm.value.begin = newValue[0]
    searchForm.value.end = newValue[1]
  } else {
    searchForm.value.begin = ''
    searchForm.value.end = ''
  }
})

// 性别选项
const genderOptions = [
  { label: '请选择', value: '' },
  { label: '男', value: '男' },
  { label: '女', value: '女' }
]

// 查询
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
}

// 清空
const handleReset = () => {
  searchForm.value = {
    name: '',
    gender: '',
    dateRange:[],
    begin: '',
    end: ''
  }
}
</script>

<template>
  <div class="emp-container">
    <div class="header">
      <h2>员工管理</h2>
    </div>

    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入员工姓名" />
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="searchForm.gender" placeholder="请选择">
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="入职时间">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item class="search-actions">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="danger" @click="handleReset">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.emp-container {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  padding-left: 10px;
  border-left: 4px solid #20a0ff;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  padding: 15px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-actions {
  margin-left: auto;
}
</style>