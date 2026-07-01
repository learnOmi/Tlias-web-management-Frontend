import { defineStore } from "pinia";
import { ref, computed } from "vue";

/**
 * 应用全局状态管理 Store
 * 管理侧边栏、主题、语言等全局配置
 */
export const useAppStore = defineStore(
  "app",
  () => {
    // ========== State ==========

    // 侧边栏是否折叠
    const sidebarCollapsed = ref(false);

    // 当前主题（light/dark）
    const theme = ref("light");

    // 当前语言
    const language = ref("zh-CN");

    // 全局加载状态
    const globalLoading = ref(false);

    // 全局加载文本
    const globalLoadingText = ref("");

    // 页面标题
    const pageTitle = ref("");

    // KeepAlive 缓存的路由名称列表
    const cachedViews = ref([]);

    // ========== Computed ==========

    const isDarkTheme = computed(() => theme.value === "dark");

    // ========== Actions ==========

    /**
     * 切换侧边栏折叠状态
     */
    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    /**
     * 设置侧边栏状态
     * @param {boolean} collapsed
     */
    const setSidebarCollapsed = (collapsed) => {
      sidebarCollapsed.value = collapsed;
    };

    /**
     * 切换主题
     */
    const toggleTheme = () => {
      theme.value = theme.value === "light" ? "dark" : "light";
      // 更新 CSS 变量或 class
      updateThemeStyle();
    };

    /**
     * 设置主题
     * @param {string} newTheme
     */
    const setTheme = (newTheme) => {
      theme.value = newTheme;
      updateThemeStyle();
    };

    /**
     * 更新主题样式到 DOM
     */
    const updateThemeStyle = () => {
      const html = document.documentElement;
      if (theme.value === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    };

    /**
     * 设置语言
     * @param {string} lang
     */
    const setLanguage = (lang) => {
      language.value = lang;
      // 这里后续会对接 i18n
    };

    /**
     * 显示全局加载
     * @param {string} text
     */
    const showGlobalLoading = (text = "加载中...") => {
      globalLoading.value = true;
      globalLoadingText.value = text;
    };

    /**
     * 隐藏全局加载
     */
    const hideGlobalLoading = () => {
      globalLoading.value = false;
      globalLoadingText.value = "";
    };

    /**
     * 设置页面标题
     * @param {string} title
     */
    const setPageTitle = (title) => {
      pageTitle.value = title;
      document.title = title ? `${title} - Tlias` : "Tlias 智能学习辅助系统";
    };

    /**
     * 添加缓存视图
     * @param {string} viewName
     */
    const addCachedView = (viewName) => {
      if (viewName && !cachedViews.value.includes(viewName)) {
        cachedViews.value.push(viewName);
      }
    };

    /**
     * 移除缓存视图
     * @param {string} viewName
     */
    const removeCachedView = (viewName) => {
      const index = cachedViews.value.indexOf(viewName);
      if (index > -1) {
        cachedViews.value.splice(index, 1);
      }
    };

    /**
     * 清除所有缓存视图
     */
    const clearCachedViews = () => {
      cachedViews.value = [];
    };

    return {
      // State
      sidebarCollapsed,
      theme,
      language,
      globalLoading,
      globalLoadingText,
      pageTitle,
      cachedViews,

      // Computed
      isDarkTheme,

      // Actions
      toggleSidebar,
      setSidebarCollapsed,
      toggleTheme,
      setTheme,
      setLanguage,
      showGlobalLoading,
      hideGlobalLoading,
      setPageTitle,
      addCachedView,
      removeCachedView,
      clearCachedViews,
    };
  },
  {
    // 持久化配置
    persist: {
      key: "tlias-app",
      storage: localStorage,
      paths: ["sidebarCollapsed", "theme", "language"],
    },
  }
);
