import axios from "axios";
import { ElMessage, ElLoading } from "element-plus";
import { useUserStore } from "@/stores";

// ========== 配置 ==========

// 基础配置
const BASE_URL = "/api";
const TIMEOUT = 15000; // 增加超时时间

// 重试配置
const RETRY_COUNT = 2; // 最大重试次数
const RETRY_DELAY = 1000; // 重试延迟（毫秒）

// 不需要 Token 的接口白名单
const WHITE_LIST = ["/login"];

// 不需要 Loading 的接口（可根据需要添加）
const NO_LOADING_LIST = [];

// 不需要重试的接口（非幂等请求）
const NO_RETRY_METHODS = ["POST", "PUT", "DELETE"];

// ========== 状态管理 ==========

// 请求队列（用于取消请求）
const pendingRequests = new Map();

// 全局 Loading 实例
let loadingInstance = null;

// 当前 Loading 请求数量
let loadingCount = 0;

// ========== 工具函数 ==========

/**
 * 生成请求唯一标识
 * @param {object} config
 * @returns {string}
 */
const generateRequestKey = (config) => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
};

/**
 * 添加请求到队列
 * @param {object} config
 */
const addPendingRequest = (config) => {
  const key = generateRequestKey(config);
  if (pendingRequests.has(key)) {
    // 取消之前的重复请求
    pendingRequests.get(key)();
  }
  config.cancelToken = new axios.CancelToken((cancel) => {
    pendingRequests.set(key, cancel);
  });
};

/**
 * 从队列移除请求
 * @param {object} config
 */
const removePendingRequest = (config) => {
  const key = generateRequestKey(config);
  if (pendingRequests.has(key)) {
    pendingRequests.delete(key);
  }
};

/**
 * 取消所有请求（路由切换时调用）
 */
export const cancelAllRequests = () => {
  pendingRequests.forEach((cancel) => cancel());
  pendingRequests.clear();
};

/**
 * 显示全局 Loading
 * @param {string} text
 */
export const showLoading = (text = "加载中...") => {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: "rgba(0, 0, 0, 0.7)",
    });
  }
  loadingCount++;
};

/**
 * 隐藏全局 Loading
 */
export const hideLoading = () => {
  loadingCount--;
  if (loadingCount <= 0) {
    loadingCount = 0;
    if (loadingInstance) {
      loadingInstance.close();
      loadingInstance = null;
    }
  }
};

/**
 * 判断是否在白名单中
 * @param {string} url
 * @returns {boolean}
 */
const isInWhiteList = (url) => {
  return WHITE_LIST.some((item) => url.includes(item));
};

/**
 * 判断是否需要 Loading
 * @param {string} url
 * @returns {boolean}
 */
const needLoading = (url) => {
  return !NO_LOADING_LIST.some((item) => url.includes(item));
};

/**
 * 判断是否需要重试
 * @param {string} method
 * @returns {boolean}
 */
const shouldRetry = (method) => {
  return !NO_RETRY_METHODS.includes(method.toUpperCase());
};

/**
 * 错误码映射
 */
const ERROR_MESSAGE_MAP = {
  400: "请求参数错误",
  401: "未授权，请重新登录",
  403: "拒绝访问",
  404: "请求资源不存在",
  405: "请求方法不允许",
  408: "请求超时",
  500: "服务器内部错误",
  501: "服务未实现",
  502: "网关错误",
  503: "服务不可用",
  504: "网关超时",
  505: "HTTP版本不受支持",
};

/**
 * 获取错误信息
 * @param {object} error
 * @returns {string}
 */
const getErrorMessage = (error) => {
  if (error.response) {
    const status = error.response.status;
    // 优先使用后端返回的错误信息
    if (error.response.data?.msg) {
      return error.response.data.msg;
    }
    // 使用映射表
    return ERROR_MESSAGE_MAP[status] || `请求失败(${status})`;
  }
  if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
    return "请求超时";
  }
  if (error.message.includes("Network Error")) {
    return "网络连接异常，请检查网络";
  }
  return error.message || "请求失败";
};

// ========== Axios 实例 ==========

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

// ========== 请求缓存 ==========

const requestCache = new Map();
const CACHE_MAX_AGE = 5 * 60 * 1000;
const CACHE_MAX_SIZE = 200;

function generateCacheKey(config) {
  const { method, url, params } = config;
  const sortedParams = params
    ? Object.keys(params)
        .sort()
        .reduce((acc, key) => {
          acc[key] = params[key];
          return acc;
        }, {})
    : {};
  return `${method?.toUpperCase()}&${url}&${JSON.stringify(sortedParams)}`;
}

function getCache(key) {
  const item = requestCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_MAX_AGE) {
    requestCache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data) {
  if (requestCache.size >= CACHE_MAX_SIZE) {
    const firstKey = requestCache.keys().next().value;
    if (firstKey) {
      requestCache.delete(firstKey);
    }
  }
  requestCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearCache(pattern) {
  if (!pattern) {
    requestCache.clear();
    return;
  }
  for (const key of requestCache.keys()) {
    if (key.includes(pattern)) {
      requestCache.delete(key);
    }
  }
}

// ========== 请求拦截器 ==========

instance.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(
        `[请求] ${config.method?.toUpperCase()} ${config.url}`,
        config.params || config.data
      );
    }

    if (config.cache && config.method?.toUpperCase() === "GET") {
      const cacheKey = generateCacheKey(config);
      const cached = getCache(cacheKey);
      if (cached) {
        if (import.meta.env.DEV) {
          console.log(`[缓存命中] ${config.url}`);
        }
        return Promise.resolve({
          data: cached,
          config,
          status: 200,
          statusText: "OK",
          headers: {},
          __fromCache: true,
        });
      }
    }

    addPendingRequest(config);

    const userStore = useUserStore();
    const token = userStore.token;
    if (token && !isInWhiteList(config.url)) {
      config.headers["token"] = token;
    }

    if (config.showLoading !== false && needLoading(config.url)) {
      showLoading(config.loadingText);
    }

    return config;
  },
  (error) => {
    hideLoading();
    ElMessage.error("请求发送失败");
    return Promise.reject(error);
  }
);

// ========== 响应拦截器 ==========

instance.interceptors.response.use(
  (response) => {
    if (response.__fromCache) {
      return response.data;
    }

    if (import.meta.env.DEV) {
      console.log(
        `[响应] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }

    removePendingRequest(response.config);

    hideLoading();

    const res = response.data;

    if (
      response.config.cache &&
      response.config.method?.toUpperCase() === "GET" &&
      res.code === 1
    ) {
      const cacheKey = generateCacheKey(response.config);
      setCache(cacheKey, res);
    }

    if (res.code === 1) {
      return res;
    }

    const errorMsg = res.msg || "操作失败";

    if (res.code === 0 && response.status === 401) {
      const userStore = useUserStore();
      userStore.clearUserData();
      ElMessage.error("登录已过期，请重新登录");
      window.location.href = "/login";
      return Promise.reject(new Error(errorMsg));
    }

    ElMessage.error(errorMsg);
    return Promise.reject(new Error(errorMsg));
  },
  async (error) => {
    if (error.config) {
      removePendingRequest(error.config);
    }

    hideLoading();

    if (axios.isCancel(error)) {
      if (import.meta.env.DEV) {
        console.log("[取消] 请求被取消", error.message);
      }
      return Promise.reject(error);
    }

    const errorMsg = getErrorMessage(error);

    if (error.response?.status === 401) {
      const userStore = useUserStore();
      userStore.clearUserData();
      ElMessage.error("登录已过期，请重新登录");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      ElMessage.error("权限不足，无法访问");
      return Promise.reject(error);
    }

    const config = error.config;
    if (
      config &&
      shouldRetry(config.method) &&
      !config._retryCount &&
      (error.code === "ECONNABORTED" || error.message.includes("Network Error"))
    ) {
      config._retryCount = config._retryCount || 0;
      if (config._retryCount < RETRY_COUNT) {
        config._retryCount++;
        if (import.meta.env.DEV) {
          console.log(`[重试] 第 ${config._retryCount} 次: ${config.url}`);
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return instance.request(config);
      }
    }

    ElMessage.error(errorMsg);
    return Promise.reject(error);
  }
);

// ========== 导出 ==========

export default instance;
