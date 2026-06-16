<script setup>
import { ref, watch, onMounted, computed } from "vue";
import {
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElMessageBox,
  ElPagination,
} from "element-plus";
import { getStudentList, deleteStudent, getAllClazzList } from "@/api/student";
import StuFormDialog from "./StuFormDialog.vue";

// 学历映射
const degreeMap = {
  1: "初中",
  2: "高中",
  3: "大专",
  4: "本科",
  5: "硕士",
  6: "博士",
};

// 班级选项（搜索用）
const clazzOptions = ref([]);

// 搜索条件
const searchForm = ref({
  name: "",
  degree: "",
  clazzId: "",
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

// 学历选项（搜索用）
const degreeOptions = [
  { label: "请选择", value: "" },
  { label: "初中", value: "1" },
  { label: "高中", value: "2" },
  { label: "大专", value: "3" },
  { label: "本科", value: "4" },
  { label: "硕士", value: "5" },
  { label: "博士", value: "6" },
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

// 查询参数（分页 + 搜索条件聚合）
const queryParams = computed(() => ({
  page: pagination.currentPage.value,
  pageSize: pagination.pageSize.value,
  name: searchForm.value.name,
  degree: searchForm.value.degree,
  clazzId: searchForm.value.clazzId,
  begin: searchForm.value.begin,
  end: searchForm.value.end,
}));

// 对话框控制
const dialogVisible = ref(false);
const dialogTitle = ref("新增学员");
const currentStudentData = ref({});

// 查询
const handleSearch = () => {
  pagination.currentPage.value = 1;
  loadData();
};

// 清空搜索条件
const handleReset = () => {
  searchForm.value = {
    name: "",
    degree: "",
    clazzId: "",
    dateRange: [],
    begin: "",
    end: "",
  };
  pagination.currentPage.value = 1;
  loadData();
};

// 加载学员列表
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getStudentList(queryParams.value);
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

// 新增学员
const handleAdd = () => {
  dialogTitle.value = "新增学员";
  currentStudentData.value = {};
  dialogVisible.value = true;
};

// 编辑学员
const handleEdit = (row) => {
  dialogTitle.value = "修改学员";
  currentStudentData.value = { ...row };
  dialogVisible.value = true;
};

// 删除学员
const handleDelete = (row) => {
  ElMessageBox.confirm("确定要删除该学员吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteStudent(row.id);
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
    ElMessage.warning("请先选择要删除的学员");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 名学员吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      const ids = selectedRows.value.map((row) => row.id);
      await deleteStudent(ids);
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

// 学历映射
const degreeLabel = (degree) => {
  return degreeMap[degree] || "-";
};

// 加载班级列表（搜索用）
const loadClazzOptions = async () => {
  const res = await getAllClazzList();
  clazzOptions.value = res.data || [];
};

onMounted(() => {
  loadData();
  loadClazzOptions();
});
</script>

<template>
  <div class="stu-container">
    <div class="header">
      <h2>学员管理</h2>
    </div>

    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="学员姓名">
        <el-input v-model="searchForm.name" placeholder="请输入学员姓名" />
      </el-form-item>

      <el-form-item label="学历">
        <el-select v-model="searchForm.degree" placeholder="请选择">
          <el-option
            v-for="item in degreeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="班级">
        <el-select v-model="searchForm.clazzId" placeholder="请选择" clearable>
          <el-option
            v-for="item in clazzOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item class="search-actions">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="danger" @click="handleReset">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">新增学员</el-button>
      <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
    </div>

    <!-- 学员表格 -->
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
        <el-table-column label="姓名" prop="name" width="120" />
        <el-table-column label="学号" prop="no" width="150" />
        <el-table-column label="性别" prop="gender" width="80" align="center">
          <template #default="{ row }">
            {{ row.gender === 1 ? "男" : row.gender === 2 ? "女" : "-" }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" width="150" />
        <el-table-column label="学历" prop="degree" width="100">
          <template #default="{ row }">
            {{ degreeLabel(row.degree) }}
          </template>
        </el-table-column>
        <el-table-column label="班级" prop="clazzName" width="150" />
        <el-table-column
          label="违纪次数"
          prop="violationCount"
          width="100"
          align="center"
        />
        <el-table-column
          label="违纪扣分"
          prop="violationScore"
          width="100"
          align="center"
        />
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

    <!-- 新增/编辑学员对话框 -->
    <StuFormDialog
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :student-data="currentStudentData"
      @submit-success="handleSubmitSuccess"
    />
  </div>
</template>

<style scoped>
.stu-container {
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
