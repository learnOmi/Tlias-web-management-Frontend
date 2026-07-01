import type { App } from "vue";
import { permission, role } from "./permission.js";
import { setupLazyImageDirective } from "./lazyImage";

export function setupDirectives(app: App): void {
  app.directive("permission", permission);
  app.directive("role", role);
  setupLazyImageDirective(app);
}

export { permission, role };
