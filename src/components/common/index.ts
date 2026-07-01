import type { App, Component } from "vue";
import DictTag from "./DictTag.vue";
import ProTable from "./ProTable.vue";
import ProFormDialog from "./ProFormDialog.vue";
import ImageUpload from "./ImageUpload.vue";
import PageHeader from "./PageHeader.vue";
import TableSkeleton from "./TableSkeleton.vue";

const components: Component[] = [
  DictTag,
  ProTable,
  ProFormDialog,
  ImageUpload,
  PageHeader,
  TableSkeleton,
];

export function setupCommonComponents(app: App): void {
  components.forEach((component) => {
    const name = (component as any).name || (component as any).__name;
    if (name) {
      app.component(name, component);
    }
  });
}

export {
  DictTag,
  ProTable,
  ProFormDialog,
  ImageUpload,
  PageHeader,
  TableSkeleton,
};
