import { setupPerformanceMonitor } from "./performance";
import { setupTrack, trackPageView, trackCustom } from "./track";
import type { App } from "vue";

export function setupMonitor(app: App): void {
  setupPerformanceMonitor();
  setupTrack();

  window.addEventListener("perf:report", ((e: CustomEvent) => {
    if (import.meta.env.DEV) {
      console.log(
        "%c[监控] 性能数据已收集",
        "color: #409EFF; font-weight: bold;",
        e.detail
      );
    }
  }) as EventListener);

  window.addEventListener("track:report", ((e: CustomEvent) => {
    if (import.meta.env.DEV) {
      console.log(
        "%c[监控] 埋点数据待上报",
        "color: #67C23A; font-weight: bold;",
        e.detail
      );
    }
  }) as EventListener);

  if (import.meta.env.DEV) {
    console.group(
      "%c🚀 前端监控系统已启动",
      "color: #409EFF; font-size: 14px; font-weight: bold;"
    );
    console.log("✅ 错误监控: 已启用 (Vue/JS/Promise/资源)");
    console.log("✅ 性能监控: 已启用 (FP/FCP/LCP/CLS/资源)");
    console.log("✅ 行为埋点: 已启用 (页面/点击/自定义)");
    console.groupEnd();
  }
}

export { trackPageView, trackCustom };
export * from "./performance";
export * from "./track";
