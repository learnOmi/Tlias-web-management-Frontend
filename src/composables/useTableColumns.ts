import { ref, watch } from "vue";

interface UseTableColumnOptions {
  key: string;
  defaultColumns: ColumnConfig[];
}

interface ColumnConfig {
  prop: string;
  label: string;
  width?: number | string;
  visible: boolean;
  fixed?: "left" | "right" | boolean;
}

const STORAGE_PREFIX = "tlias_table_";

export function useTableColumns(options: UseTableColumnOptions) {
  const { key, defaultColumns } = options;
  const storageKey = STORAGE_PREFIX + key;

  const loadFromStorage = (): ColumnConfig[] => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load table columns from storage:", e);
    }
    return [...defaultColumns];
  };

  const columns = ref<ColumnConfig[]>(loadFromStorage());

  const saveToStorage = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(columns.value));
    } catch (e) {
      console.warn("Failed to save table columns to storage:", e);
    }
  };

  watch(columns, saveToStorage, { deep: true });

  const visibleColumns = ref(
    columns.value.filter((col) => col.visible !== false)
  );

  const toggleColumn = (prop: string) => {
    const col = columns.value.find((c) => c.prop === prop);
    if (col) {
      col.visible = !col.visible;
      visibleColumns.value = columns.value.filter((c) => c.visible !== false);
    }
  };

  const resetColumns = () => {
    columns.value = [...defaultColumns];
    visibleColumns.value = columns.value.filter((c) => c.visible !== false);
  };

  const setColumnWidth = (prop: string, width: number | string) => {
    const col = columns.value.find((c) => c.prop === prop);
    if (col) {
      col.width = width;
    }
  };

  return {
    columns,
    visibleColumns,
    toggleColumn,
    resetColumns,
    setColumnWidth,
  };
}
