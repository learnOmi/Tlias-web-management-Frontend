export interface BuildInfo {
  version: string;
  env: string;
  buildTime: string;
  appEnv: string;
}

export function getBuildInfo(): BuildInfo {
  return {
    version: __BUILD_VERSION__ || "1.0.0",
    env: __BUILD_ENV__ || "development",
    buildTime: __BUILD_TIME__ || "",
    appEnv: __APP_ENV__ || "development",
  };
}

export function printBuildInfo(): void {
  const info = getBuildInfo();
  console.group(
    "%c🚀 应用信息",
    "color: #409EFF; font-size: 14px; font-weight: bold;"
  );
  console.log(`版本号: ${info.version}`);
  console.log(`构建环境: ${info.env}`);
  console.log(`运行环境: ${info.appEnv}`);
  console.log(`构建时间: ${info.buildTime}`);
  console.groupEnd();
}

export function isDev(): boolean {
  return __APP_ENV__ === "development";
}

export function isProd(): boolean {
  return __APP_ENV__ === "production";
}

export function isTest(): boolean {
  return __APP_ENV__ === "test";
}

export function isStaging(): boolean {
  return __APP_ENV__ === "staging";
}

export default {
  getBuildInfo,
  printBuildInfo,
  isDev,
  isProd,
  isTest,
  isStaging,
};
