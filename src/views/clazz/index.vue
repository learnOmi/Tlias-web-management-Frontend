<script setup>
import { ref, watch, onMounted, computed } from "vue";
import {
  ElInput,
  ElDatePicker,
  ElButton,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElTag,
} from "element-plus";
import { getClassList, deleteClazz } from "@/api/clazz";
import ClazzFormDialog from "./ClazzFormDialog.vue";

// 搜索条件
const searchForm = ref({
  name: "",
  dateRange: [],
  begin: "",
  end: "",
});

// 监听dateRange变化
watch(
  () => searchForm.value.dateRange,
  (newValue) => {
    if (newValue && newValue.length === 2) {
      searchForm.value.begin = newValue[0];
      searchForm.value.end = newValue[1];
    } else {
      searchForm.value.begin = "";
      searchForm.value.end = "";
    }
  }
);

// 表格数据
const tableData = ref([]);
const selectedRows = ref([]);
const loading = ref(false);

// 分页相关参数（聚合）
const pagination = {
  currentPage: ref(1),
  pageSize: ref(10),
  total: ref(0),
};

// 查询参数（分页 + 搜索条件聚合）
const queryParams = computed(() => ({
  page: pagination.currentPage.value,
  pageSize: pagination.pageSize.value,
  name: searchForm.value.name,
  begin: searchForm.value.begin,
  end: searchForm.value.end,
}));

// 对话框控制
const dialogVisible = ref(false);
const dialogTitle = ref("新增班级");
const currentClazzData = ref({});

// 查询
const handleSearch = () => {
  pagination.currentPage.value = 1;
  loadData();
};

// 清空搜索条件
const handleReset = () => {
  searchForm.value = {
    name: "",
    dateRange: [],
    begin: "",
    end: "",
  };
  pagination.currentPage.value = 1;
  loadData();
};

// 加载班级列表
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getClassList(queryParams.value);
    tableData.value = res.data?.rows || [];
    pagination.total.value = res.data?.total || 0;
  } finally {
    loading.value = false;
  }
};

// 分页变化
const handlePageChange = (page) => {
  pagination.currentPage.value = page;
  loadData();
};

const handleSizeChange = (size) => {
  pagination.pageSize.value = size;
  pagination.currentPage.value = 1;
  loadData();
};

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

// 新增班级
const handleAdd = () => {
  dialogTitle.value = "新增班级";
  currentClazzData.value = {};
  dialogVisible.value = true;
};

// 编辑班级
const handleEdit = (row) => {
  dialogTitle.value = "修改班级";
  currentClazzData.value = { ...row };
  dialogVisible.value = true;
};

// 删除班级
const handleDelete = (row) => {
  ElMessageBox.confirm("确定要删除该班级吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteClazz(row.id);
      ElMessage.success("删除成功");
      loadData();
    })
    .catch(() => {
      // 用户取消删除
    });
};

// 对话框提交成功回调
const handleSubmitSuccess = () => {
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="clazz-container">
    <div class="header">
      <h2>班级管理</h2>
    </div>

    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="班级名称">
        <el-input v-model="searchForm.name" placeholder="请输入班级名称" />
      </el-form-item>

      <el-form-item label="结课时间">
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

    <!-- 操作按钮栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">新增班级</el-button>
    </div>

    <!-- 班级表格 -->
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center"
          :index="
            (index) =>
              (pagination.currentPage.value - 1) * pagination.pageSize.value +
              index +
              1
          "
        />
        <el-table-column label="班级名称" prop="name" width="180" />
        <el-table-column label="班级教室" prop="room" width="120" />
        <el-table-column label="开课时间" prop="beginDate" width="150" />
        <el-table-column label="结课时间" prop="endDate" width="150" />
        <el-table-column label="班主任" prop="masterName" width="120" />
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === '已开班'
                  ? 'success'
                  : row.status === '已结课'
                  ? 'info'
                  : 'warning'
              "
              size="small"
            >
              {{ row.status || "-" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="170" />
        <el-table-column label="最后操作时间" prop="updateTime" width="170" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <div class="action-buttons">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="pagination.currentPage.value"
        :page-size="pagination.pageSize.value"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total.value"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 新增/编辑班级对话框 -->
    <ClazzFormDialog
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :clazz-data="currentClazzData"
      @submit-success="handleSubmitSuccess"
    />
  </div>
</template>

<style scoped>
.clazz-container {
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

/* 操作按钮栏 */
.action-bar {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
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
