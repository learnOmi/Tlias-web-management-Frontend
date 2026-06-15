<script setup>
import { ref, watch, onMounted, computed } from "vue";
import {
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElButton,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElAvatar,
} from "element-plus";
import { getEmpList, deleteEmp, deleteEmps } from "@/api/emp";
import EmpFormDialog from "./EmpFormDialog.vue";

// 搜索条件
const searchForm = ref({
  name: "",
  gender: "",
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

// 性别选项（搜索用字符串）
const genderOptions = [
  { label: "请选择", value: "" },
  { label: "男", value: "男" },
  { label: "女", value: "女" },
];

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

// 查询参数（分页 + 搜索条件聚合）— gender 转后端要求的 1/2
const queryParams = computed(() => {
  const genderMap = { 男: "1", 女: "2" };
  return {
    page: pagination.currentPage.value,
    pageSize: pagination.pageSize.value,
    name: searchForm.value.name,
    gender: genderMap[searchForm.value.gender] || "",
    begin: searchForm.value.begin,
    end: searchForm.value.end,
  };
});

// 对话框控制
const dialogVisible = ref(false);
const dialogTitle = ref("新增员工");
const currentEmpData = ref({});

// 查询
const handleSearch = () => {
  pagination.currentPage.value = 1;
  loadData();
};

// 清空搜索条件
const handleReset = () => {
  searchForm.value = {
    name: "",
    gender: "",
    dateRange: [],
    begin: "",
    end: "",
  };
  pagination.currentPage.value = 1;
  loadData();
};

// 加载员工列表
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getEmpList(queryParams.value);
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

// 新增员工
const handleAdd = () => {
  dialogTitle.value = "新增员工";
  currentEmpData.value = {};
  dialogVisible.value = true;
};

// 编辑员工
const handleEdit = (row) => {
  dialogTitle.value = "修改员工";
  currentEmpData.value = { ...row };
  dialogVisible.value = true;
};

// 删除单个员工
const handleDelete = (row) => {
  ElMessageBox.confirm("确定要删除该员工吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteEmp(row.id);
      ElMessage.success("删除成功");
      loadData();
    })
    .catch(() => {
      // 用户取消删除
    });
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请先选择要删除的员工");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 名员工吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      const ids = selectedRows.value.map((row) => row.id);
      await deleteEmps(ids);
      ElMessage.success("批量删除成功");
      selectedRows.value = [];
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
  <div class="emp-container">
    <div class="header">
      <h2>员工管理</h2>
    </div>

    <!-- 搜索栏 -->
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

    <!-- 操作按钮栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">新增员工</el-button>
      <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
    </div>

    <!-- 员工表格 -->
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
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar v-if="row.image" :size="40" :src="row.image" />
            <el-avatar v-else :size="40">无</el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="username" width="150" />
        <el-table-column label="姓名" prop="name" width="120" />
        <el-table-column label="性别" prop="gender" width="80" align="center">
          <template #default="{ row }">
            {{ row.gender === 1 ? "男" : row.gender === 2 ? "女" : "-" }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" width="150" />
        <el-table-column label="职位" prop="job" width="120">
          <template #default="{ row }">
            {{
              row.job === 1
                ? "班主任"
                : row.job === 2
                ? "讲师"
                : row.job === 3
                ? "学工主管"
                : row.job === 4
                ? "教研主管"
                : row.job === 5
                ? "咨询师"
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column label="所属部门" prop="deptId" width="150">
          <template #default="{ row }">
            {{ row.deptName || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="入职日期" prop="entryDate" width="150" />
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

    <!-- 新增/编辑员工对话框 -->
    <EmpFormDialog
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :emp-data="currentEmpData"
      @submit-success="handleSubmitSuccess"
    />
  </div>
</template>

<style scoped>
.emp-container {
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
