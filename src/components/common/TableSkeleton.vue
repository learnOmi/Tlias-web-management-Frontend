<template>
  <div class="skeleton-wrapper">
    <div
      v-for="i in rows"
      :key="i"
      class="skeleton-row"
      :style="{ height: rowHeight + 'px' }"
    >
      <div
        v-for="j in columns"
        :key="j"
        class="skeleton-col"
        :style="{
          width: columnWidths[j - 1] || `${100 / columns}%`,
          height: rowHeight - 16 + 'px',
        }"
      >
        <div class="skeleton-shimmer"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  rows?: number;
  columns?: number;
  rowHeight?: number;
  columnWidths?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: 4,
  rowHeight: 48,
  columnWidths: () => [],
});

const widthArr = computed(() => {
  if (props.columnWidths.length > 0) return props.columnWidths;
  return Array(props.columns).fill(`${100 / props.columns}%`);
});
</script>

<style scoped>
.skeleton-wrapper {
  width: 100%;
  padding: 16px 0;
}
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  margin-bottom: 8px;
}
.skeleton-col {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background: #f2f2f2;
}
.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
