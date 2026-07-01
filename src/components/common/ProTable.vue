<template>
  <div class="pro-table">
    <div class="pro-table-search" v-if="showSearch">
      <slot name="search">
        <el-form :model="searchForm" inline @submit.prevent>
          <slot name="search-form">
            <el-form-item
              v-for="item in searchColumns"
              :key="item.prop"
              :label="item.label"
            >
              <el-input
                v-if="item.type === 'input' || !item.type"
                v-model="searchForm[item.prop]"
                :placeholder="`请输入${item.label}`"
                clearable
                @keyup.enter="handleSearch"
              />
              <el-select
                v-else-if="item.type === 'select'"
                v-model="searchForm[item.prop]"
                :placeholder="`请选择${item.label}`"
                clearable
                @change="handleSearch"
              >
                <el-option
                  v-for="opt in item.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <el-date-picker
                v-else-if="item.type === 'date'"
                v-model="searchForm[item.prop]"
                :type="item.dateType || 'date'"
                :placeholder="`请选择${item.label}`"
                value-format="YYYY-MM-DD"
                @change="handleSearch"
              />
            </el-form-item>
          </slot>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </slot>
    </div>

    <div class="pro-table-toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left">
          <el-button type="primary" v-if="addVisible" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
          <el-button
            type="danger"
            v-if="batchDeleteVisible"
            :disabled="!selected.length"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </slot>
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right" />
      </div>
    </div>

    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="selectable"
        type="selection"
        width="50"
        align="center"
      />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <slot />
      <el-table-column
        v-if="$slots.action"
        label="操作"
        :width="actionWidth"
        align="center"
        fixed="right"
      >
        <template #default="scope">
          <slot name="action" :row="scope.row" :index="scope.$index" />
        </template>
      </el-table-column>
    </el-table>

    <div class="pro-table-pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";

interface SearchColumn {
  prop: string;
  label: string;
  type?: "input" | "select" | "date";
  dateType?: string;
  options?: Array<{ label: string; value: string | number }>;
}

interface Props {
  loading?: boolean;
  data?: any[];
  total?: number;
  page?: number;
  pageSize?: number;
  searchColumns?: SearchColumn[];
  showSearch?: boolean;
  selectable?: boolean;
  addVisible?: boolean;
  batchDeleteVisible?: boolean;
  actionWidth?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  data: () => [],
  total: 0,
  page: 1,
  pageSize: 10,
  searchColumns: () => [],
  showSearch: true,
  selectable: false,
  addVisible: false,
  batchDeleteVisible: false,
  actionWidth: 200,
});

const emit = defineEmits<{
  search: [form: Record<string, any>];
  reset: [];
  pageChange: [page: number];
  sizeChange: [size: number];
  add: [];
  batchDelete: [ids: number[]];
}>();

const tableRef = ref();
const selected = ref<any[]>([]);

const searchForm = reactive<Record<string, any>>({});
const pagination = reactive({
  page: props.page,
  pageSize: props.pageSize,
});

watch(
  () => props.page,
  (val) => {
    pagination.page = val;
  }
);

watch(
  () => props.pageSize,
  (val) => {
    pagination.pageSize = val;
  }
);

const tableData = ref(props.data);
watch(
  () => props.data,
  (val) => {
    tableData.value = val;
  }
);

function handleSearch() {
  pagination.page = 1;
  emit("search", { ...searchForm });
}

function handleReset() {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = "";
  });
  pagination.page = 1;
  emit("reset");
  emit("search", { ...searchForm });
}

function handleSelectionChange(val: any[]) {
  selected.value = val;
}

function handleSizeChange(val: number) {
  pagination.pageSize = val;
  emit("sizeChange", val);
}

function handleCurrentChange(val: number) {
  pagination.page = val;
  emit("pageChange", val);
}

function handleAdd() {
  emit("add");
}

function handleBatchDelete() {
  emit(
    "batchDelete",
    selected.value.map((item) => item.id)
  );
}

function clearSelection() {
  tableRef.value?.clearSelection();
}

defineExpose({
  clearSelection,
  searchForm,
  pagination,
});
</script>

<style scoped>
.pro-table {
  width: 100%;
}
.pro-table-search {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}
.pro-table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.pro-table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
