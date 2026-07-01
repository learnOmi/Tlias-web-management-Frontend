import { createRouter, createWebHistory } from "vue-router";
import { useUserStore, useAppStore } from "@/stores";
import { cancelAllRequests } from "@/utils/axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// NProgress 配置
NProgress.configure({
  showSpinner: false,
  speed: 500,
  trickleSpeed: 200,
});

// 路由白名单（不需要登录）
const WHITE_LIST = ["/login", "/403", "/404", "/500"];

// 静态路由配置
const routes = [
  {
    path: "/",
    name: "index",
    redirect: "/index",
  },
  {
    path: "/login",
    name: "登录",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录" },
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/error/403.vue"),
    meta: { title: "权限不足" },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: { title: "页面不存在" },
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/error/500.vue"),
    meta: { title: "服务器错误" },
  },
  {
    path: "/",
    component: () => import("@/views/layout/index.vue"),
    children: [
      { path: "", redirect: "/index" },
      {
        path: "index",
        name: "首页",
        component: () => import("@/views/index/index.vue"),
        meta: { title: "首页" },
      },
      {
        path: "dept",
        name: "部门管理",
        component: () => import("@/views/dept/index.vue"),
        meta: { title: "部门管理", permission: "system:dept:list" },
      },
      {
        path: "emp",
        name: "员工管理",
        component: () => import("@/views/emp/index.vue"),
        meta: { title: "员工管理", permission: "system:emp:list" },
      },
      {
        path: "clazz",
        name: "班级管理",
        component: () => import("@/views/clazz/index.vue"),
        meta: { title: "班级管理", permission: "stu:clazz:list" },
      },
      {
        path: "stu",
        name: "学生管理",
        component: () => import("@/views/stu/index.vue"),
        meta: { title: "学生管理", permission: "stu:stu:list" },
      },
      {
        path: "report/log",
        name: "日志管理",
        component: () => import("@/views/log/index.vue"),
        meta: { title: "日志管理", permission: "report:log:view" },
      },
      {
        path: "report/emp",
        name: "员工报表",
        component: () => import("@/views/report/emp/index.vue"),
        meta: { title: "员工报表", permission: "report:emp:view" },
      },
      {
        path: "report/stu",
        name: "学生报表",
        component: () => import("@/views/report/stu/index.vue"),
        meta: { title: "学生报表", permission: "report:stu:view" },
      },
    ],
  },
  // 捕获所有未匹配的路由
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 路由守卫：前置
router.beforeEach((to) => {
  // 开始进度条
  NProgress.start();

  // 取消所有未完成的请求
  cancelAllRequests();

  const userStore = useUserStore();
  const token = userStore.token;

  // 白名单路由直接放行
  if (WHITE_LIST.includes(to.path)) {
    // 已登录访问登录页，重定向到首页
    if (to.path === "/login" && token) {
      return "/index";
    }
    return;
  }

  // 未登录，重定向到登录页
  if (!token) {
    return "/login";
  }

  // 权限检查（路由级）
  const permission = to.meta?.permission;
  if (permission && !userStore.hasPermission(permission)) {
    return "/403";
  }

  return;
});

// 路由守卫：后置
router.afterEach((to) => {
  // 结束进度条
  NProgress.done();

  // 设置页面标题
  const title = to.meta?.title;
  if (title) {
    document.title = `${title} - Tlias`;
  } else {
    document.title = "Tlias 智能学习辅助系统";
  }

  // KeepAlive 缓存管理
  const appStore = useAppStore();
  if (to.meta?.keepAlive && to.name) {
    appStore.addCachedView(to.name);
  }
});

export default router;
