export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel;
  levelName: string;
  message: string;
  data?: any;
  timestamp: number;
  url: string;
  userAgent: string;
  module?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enabled: boolean;
  maxQueueSize: number;
  reportUrl: string;
  reportInterval: number;
  reportLevel: LogLevel;
  consoleEnabled: boolean;
}

const defaultConfig: LoggerConfig = {
  level: LogLevel.DEBUG,
  enabled: true,
  maxQueueSize: 200,
  reportUrl: "/api/log/report",
  reportInterval: 10000,
  reportLevel: LogLevel.ERROR,
  consoleEnabled: true,
};

let config = { ...defaultConfig };
const logQueue: LogEntry[] = [];
let reportTimer: ReturnType<typeof setInterval> | null = null;

const levelNames: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
  [LogLevel.FATAL]: "FATAL",
};

const levelStyles: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "color: #909399;",
  [LogLevel.INFO]: "color: #409EFF;",
  [LogLevel.WARN]: "color: #E6A23C;",
  [LogLevel.ERROR]: "color: #F56C6C;",
  [LogLevel.FATAL]: "color: #C0392B; font-weight: bold;",
};

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}.${date.getMilliseconds().toString().padStart(3, "0")}`;
}

function createLogEntry(
  level: LogLevel,
  message: string,
  data?: any,
  module?: string
): LogEntry {
  return {
    level,
    levelName: levelNames[level],
    message,
    data,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    module,
  };
}

function outputToConsole(entry: LogEntry): void {
  if (!config.consoleEnabled) return;

  const style = levelStyles[entry.level];
  const time = formatTime(entry.timestamp);
  const prefix = `[${time}] [${entry.levelName}]${
    entry.module ? ` [${entry.module}]` : ""
  }`;

  switch (entry.level) {
    case LogLevel.DEBUG:
      if (entry.data) {
        console.debug(`%c${prefix} ${entry.message}`, style, entry.data);
      } else {
        console.debug(`%c${prefix} ${entry.message}`, style);
      }
      break;
    case LogLevel.INFO:
      if (entry.data) {
        console.info(`%c${prefix} ${entry.message}`, style, entry.data);
      } else {
        console.info(`%c${prefix} ${entry.message}`, style);
      }
      break;
    case LogLevel.WARN:
      if (entry.data) {
        console.warn(`%c${prefix} ${entry.message}`, style, entry.data);
      } else {
        console.warn(`%c${prefix} ${entry.message}`, style);
      }
      break;
    case LogLevel.ERROR:
    case LogLevel.FATAL:
      if (entry.data) {
        console.error(`%c${prefix} ${entry.message}`, style, entry.data);
      } else {
        console.error(`%c${prefix} ${entry.message}`, style);
      }
      break;
  }
}

function addToQueue(entry: LogEntry): void {
  if (logQueue.length >= config.maxQueueSize) {
    logQueue.shift();
  }
  logQueue.push(entry);

  if (entry.level >= config.reportLevel) {
    report();
  }
}

function report(): void {
  if (logQueue.length === 0) return;

  const logs = logQueue.filter((log) => log.level >= config.reportLevel);
  if (logs.length === 0) return;

  const reportData = {
    logs,
    timestamp: Date.now(),
  };

  const event = new CustomEvent("logger:report", { detail: reportData });
  window.dispatchEvent(event);

  if (navigator.sendBeacon && config.reportUrl) {
    const blob = new Blob([JSON.stringify(reportData)], {
      type: "application/json",
    });
    navigator.sendBeacon(config.reportUrl, blob);
  }

  for (let i = logQueue.length - 1; i >= 0; i--) {
    if (logQueue[i].level >= config.reportLevel) {
      logQueue.splice(i, 1);
    }
  }
}

export class Logger {
  private module?: string;

  constructor(module?: string) {
    this.module = module;
  }

  debug(message: string, data?: any): void {
    if (!config.enabled || config.level > LogLevel.DEBUG) return;
    const entry = createLogEntry(LogLevel.DEBUG, message, data, this.module);
    outputToConsole(entry);
    addToQueue(entry);
  }

  info(message: string, data?: any): void {
    if (!config.enabled || config.level > LogLevel.INFO) return;
    const entry = createLogEntry(LogLevel.INFO, message, data, this.module);
    outputToConsole(entry);
    addToQueue(entry);
  }

  warn(message: string, data?: any): void {
    if (!config.enabled || config.level > LogLevel.WARN) return;
    const entry = createLogEntry(LogLevel.WARN, message, data, this.module);
    outputToConsole(entry);
    addToQueue(entry);
  }

  error(message: string, data?: any): void {
    if (!config.enabled || config.level > LogLevel.ERROR) return;
    const entry = createLogEntry(LogLevel.ERROR, message, data, this.module);
    outputToConsole(entry);
    addToQueue(entry);
  }

  fatal(message: string, data?: any): void {
    if (!config.enabled || config.level > LogLevel.FATAL) return;
    const entry = createLogEntry(LogLevel.FATAL, message, data, this.module);
    outputToConsole(entry);
    addToQueue(entry);
  }
}

const globalLogger = new Logger();

export function createLogger(module?: string): Logger {
  return new Logger(module);
}

export function setupLogger(customConfig?: Partial<LoggerConfig>): void {
  if (customConfig) {
    config = { ...defaultConfig, ...customConfig };
  }

  if (import.meta.env.DEV) {
    config.level = LogLevel.DEBUG;
    config.consoleEnabled = true;
  } else {
    config.level = LogLevel.WARN;
    config.consoleEnabled = false;
  }

  reportTimer = setInterval(report, config.reportInterval);

  window.addEventListener("beforeunload", () => {
    report();
    if (reportTimer) {
      clearInterval(reportTimer);
    }
  });
}

export function getLogs(): LogEntry[] {
  return [...logQueue];
}

export function clearLogs(): void {
  logQueue.length = 0;
}

export default {
  setup: setupLogger,
  create: createLogger,
  getLogs,
  clearLogs,
  LogLevel,
  debug: (msg: string, data?: any) => globalLogger.debug(msg, data),
  info: (msg: string, data?: any) => globalLogger.info(msg, data),
  warn: (msg: string, data?: any) => globalLogger.warn(msg, data),
  error: (msg: string, data?: any) => globalLogger.error(msg, data),
  fatal: (msg: string, data?: any) => globalLogger.fatal(msg, data),
};
