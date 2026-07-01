export interface TrackEvent {
  type: "pageview" | "click" | "custom";
  event: string;
  data?: Record<string, any>;
  url: string;
  timestamp: number;
  userAgent: string;
  duration?: number;
}

export interface TrackConfig {
  enabled: boolean;
  batchSize: number;
  throttleTime: number;
  maxQueueSize: number;
  reportUrl: string;
}

const defaultConfig: TrackConfig = {
  enabled: true,
  batchSize: 10,
  throttleTime: 5000,
  maxQueueSize: 100,
  reportUrl: "/api/log/track",
};

let config = { ...defaultConfig };
const eventQueue: TrackEvent[] = [];
let reportTimer: ReturnType<typeof setTimeout> | null = null;
let pageStartTime = Date.now();

function isEnabled(): boolean {
  return config.enabled && !import.meta.env.DEV;
}

function track(
  event: Omit<TrackEvent, "timestamp" | "url" | "userAgent">
): void {
  if (!isEnabled()) {
    if (import.meta.env.DEV) {
      console.group("%c[埋点]", "color: #67C23A; font-weight: bold;");
      console.log("事件:", event.event);
      console.log("类型:", event.type);
      if (event.data) {
        console.log("数据:", event.data);
      }
      console.groupEnd();
    }
    return;
  }

  const trackEvent: TrackEvent = {
    ...event,
    url: window.location.href,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
  };

  if (eventQueue.length >= config.maxQueueSize) {
    eventQueue.shift();
  }
  eventQueue.push(trackEvent);

  if (eventQueue.length >= config.batchSize) {
    report();
  } else if (!reportTimer) {
    reportTimer = setTimeout(report, config.throttleTime);
  }
}

function report(): void {
  if (reportTimer) {
    clearTimeout(reportTimer);
    reportTimer = null;
  }

  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0;

  if (import.meta.env.DEV) {
    console.log("[埋点] 批量上报:", events.length, "条");
  }

  const reportEvent = new CustomEvent("track:report", { detail: { events } });
  window.dispatchEvent(reportEvent);
}

export function trackPageView(pageName?: string): void {
  const now = Date.now();
  const duration = now - pageStartTime;
  pageStartTime = now;

  track({
    type: "pageview",
    event: pageName || window.location.pathname,
    data: {
      path: window.location.pathname,
      duration,
    },
  });
}

export function trackClick(element: string, data?: Record<string, any>): void {
  track({
    type: "click",
    event: element,
    data,
  });
}

export function trackCustom(
  eventName: string,
  data?: Record<string, any>
): void {
  track({
    type: "custom",
    event: eventName,
    data,
  });
}

export function setupTrack(customConfig?: Partial<TrackConfig>): void {
  if (customConfig) {
    config = { ...defaultConfig, ...customConfig };
  }

  const observer = new MutationObserver(() => {
    document.querySelectorAll("[data-track]").forEach((el) => {
      if ((el as any).__trackBound) return;
      (el as any).__trackBound = true;
      el.addEventListener("click", () => {
        const trackEvent = el.getAttribute("data-track");
        const trackData = el.getAttribute("data-track-data");
        trackClick(
          trackEvent || "click",
          trackData ? JSON.parse(trackData) : undefined
        );
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("beforeunload", () => {
    if (eventQueue.length > 0) {
      const blob = new Blob([JSON.stringify({ events: eventQueue })], {
        type: "application/json",
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(config.reportUrl, blob);
      }
    }
  });
}

export default {
  setup: setupTrack,
  trackPageView,
  trackClick,
  trackCustom,
};
