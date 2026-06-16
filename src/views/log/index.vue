<script setup>
import { ref, onMounted } from "vue";
import {
  ElInput,
  ElButton,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElMessage,
} from "element-plus";
import { getLogList } from "@/api/log";

// 搜索条件
const searchForm = ref({
  operateEmpName: "",
});

// 表格数据
const tableData = ref([]);
const loading = ref(false);

// 分页相关参数（聚合）
const pagination = {
  currentPage: ref(1),
  pageSize: ref(10),
  total: ref(0),
};

// 查询参数（分页 + 搜索条件聚合）
const queryParams = ref({
  page: pagination.currentPage.value,
  pageSize: pagination.pageSize.value,
  operateEmpName: searchForm.value.operateEmpName,
});

// 查询
const handleSearch = () => {
  pagination.currentPage.value = 1;
  queryParams.value = {
    page: pagination.currentPage.value,
    pageSize: pagination.pageSize.value,
    operateEmpName: searchForm.value.operateEmpName,
  };
  loadData();
};

// 清空搜索条件
const handleReset = () => {
  searchForm.value = {
    operateEmpName: "",
  };
  pagination.currentPage.value = 1;
  queryParams.value = {
    page: pagination.currentPage.value,
    pageSize: pagination.pageSize.value,
    operateEmpName: searchForm.value.operateEmpName,
  };
  loadData();
};

// 加载日志列表
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getLogList(queryParams.value);
    tableData.value = res.data?.rows || [];
    pagination.total.value = res.data?.total || 0;
  } finally {
    loading.value = false;
  }
};

// 分页变化
const handlePageChange = (page) => {
  pagination.currentPage.value = page;
  queryParams.value.page = page;
  loadData();
};

const handleSizeChange = (size) => {
  pagination.pageSize.value = size;
  pagination.currentPage.value = 1;
  queryParams.value.page = 1;
  queryParams.value.pageSize = size;
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="log-container">
    <div class="header">
      <h2>日志管理</h2>
    </div>

    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="操作人">
        <el-input
          v-model="searchForm.operateEmpName"
          placeholder="请输入操作人姓名"
        />
      </el-form-item>

      <el-form-item class="search-actions">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="danger" @click="handleReset">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 日志表格 -->
    <div class="table-wrapper">
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center"
          :index="
            (index) =>
              (pagination.currentPage - 1) * pagination.pageSize + index + 1
          "
        />
        <el-table-column label="操作人" prop="operateEmpName" width="120" />
        <el-table-column label="操作时间" prop="operateTime" width="170" />
        <el-table-column
          label="类名"
          prop="className"
          min-width="250"
          show-overflow-tooltip
        />
        <el-table-column label="方法名" prop="methodName" width="120" />
        <el-table-column
          label="请求参数"
          prop="methodParams"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="返回值"
          prop="returnValue"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="耗时(ms)"
          prop="costTime"
          width="100"
          align="center"
        />
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.log-container {
  padding: 20px;
  max-width: none;
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

/* 表格容器 */
.table-wrapper {
  margin-top: 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0;
  overflow: hidden;
}

/* 分页容器 */
.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}
</style>
