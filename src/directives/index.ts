import type { App } from "vue";
import { permission, role } from "./permission.js";
import imageLazyDirective from "./lazyImage";

export function setupDirectives(app: App): void {
  app.directive("permission", permission);
  app.directive("role", role);
  app.directive("lazy", imageLazyDirective);
}
