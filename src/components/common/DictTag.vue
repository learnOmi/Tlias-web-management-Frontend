<template>
  <el-tag v-if="dictItem" :type="dictItem.tagType || 'info'" effect="light">
    {{ dictItem.label }}
  </el-tag>
  <span v-else>-</span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDictStore } from "@/stores/modules/dict";

interface Props {
  dictType: string;
  value: string | number;
}

const props = defineProps<Props>();

const dictStore = useDictStore();

const dictItem = computed(() => {
  return dictStore.getDictItem(props.dictType, props.value);
});
</script>
