export interface PerformanceMetrics {
  fp: number;
  fcp: number;
  lcp: number;
  tti: number;
  tbt: number;
  cls: number;
  navigationTiming: PerformanceNavigationTiming | null;
  resourceList: PerformanceResourceTiming[];
}

export interface PerfReportData {
  type: string;
  metrics: Partial<PerformanceMetrics>;
  url: string;
  timestamp: number;
  userAgent: string;
}

const metrics: Partial<PerformanceMetrics> = {
  resourceList: [],
};

let observer: PerformanceObserver | null = null;
let isReady = false;

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function formatTime(ms: number): string {
  if (ms < 1000) return ms.toFixed(2) + " ms";
  return (ms / 1000).toFixed(2) + " s";
}

function collectNavigationTiming(): void {
  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  if (navigation) {
    metrics.navigationTiming = navigation;

    const ttfb = navigation.responseStart - navigation.requestStart;
    const domReady = navigation.domContentLoadedEventEnd - navigation.startTime;
    const loadTime = navigation.loadEventEnd - navigation.startTime;

    if (import.meta.env.DEV) {
      console.group(
        "%c[性能监控] 导航性能",
        "color: #409EFF; font-weight: bold;"
      );
      console.log(
        "DNS 查询:",
        formatTime(navigation.domainLookupEnd - navigation.domainLookupStart)
      );
      console.log(
        "TCP 连接:",
        formatTime(navigation.connectEnd - navigation.connectStart)
      );
      console.log("TTFB:", formatTime(ttfb));
      console.log("DOM Ready:", formatTime(domReady));
      console.log("Load 完成:", formatTime(loadTime));
      console.log("完整数据:", navigation);
      console.groupEnd();
    }
  }
}

function collectResourceTiming(): void {
  const resources = performance.getEntriesByType(
    "resource"
  ) as PerformanceResourceTiming[];
  metrics.resourceList = resources;

  if (import.meta.env.DEV) {
    console.group(
      "%c[性能监控] 资源加载",
      "color: #67C23A; font-weight: bold;"
    );
    resources.forEach((resource) => {
      console.log(
        `${resource.name.split("/").pop()}`,
        `| 大小: ${formatSize(resource.transferSize)}`,
        `| 耗时: ${formatTime(resource.duration)}`
      );
    });
    console.log("资源总数:", resources.length);
    console.groupEnd();
  }
}

function observeFCP(): void {
  if ("PerformanceObserver" in window) {
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          metrics.fcp = entry.startTime;
          if (import.meta.env.DEV) {
            console.log(
              "%c[性能监控] FCP (首次内容绘制):",
              "color: #E6A23C; font-weight: bold;",
              formatTime(entry.startTime)
            );
          }
        }
        if (entry.name === "first-paint") {
          metrics.fp = entry.startTime;
          if (import.meta.env.DEV) {
            console.log(
              "%c[性能监控] FP (首次绘制):",
              "color: #E6A23C; font-weight: bold;",
              formatTime(entry.startTime)
            );
          }
        }
      }
    });
    observer.observe({ entryTypes: ["paint"] });
  }
}

function observeLCP(): void {
  if ("PerformanceObserver" in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
        if (import.meta.env.DEV) {
          console.log(
            "%c[性能监控] LCP (最大内容绘制):",
            "color: #F56C6C; font-weight: bold;",
            formatTime(lastEntry.startTime)
          );
        }
      }
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  }
}

function observeCLS(): void {
  if ("PerformanceObserver" in window) {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          metrics.cls = clsValue;
          if (import.meta.env.DEV) {
            console.log(
              "%c[性能监控] CLS (累计布局偏移):",
              "color: #909399; font-weight: bold;",
              clsValue.toFixed(4)
            );
          }
        }
      }
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  }
}

function collectOnLoad(): void {
  window.addEventListener("load", () => {
    setTimeout(() => {
      collectNavigationTiming();
      collectResourceTiming();
      isReady = true;

      reportMetrics();
    }, 0);
  });
}

function reportMetrics(): void {
  const reportData: PerfReportData = {
    type: "performance",
    metrics,
    url: window.location.href,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
  };

  const event = new CustomEvent("perf:report", { detail: reportData });
  window.dispatchEvent(event);
}

export function getMetrics(): Partial<PerformanceMetrics> {
  return { ...metrics };
}

export function setupPerformanceMonitor(): void {
  if (isReady) return;

  observeFCP();
  observeLCP();
  observeCLS();
  collectOnLoad();
}

export default {
  setup: setupPerformanceMonitor,
  getMetrics,
};
