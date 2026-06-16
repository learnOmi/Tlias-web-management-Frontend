import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/index'
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    children: [
      { path: '', redirect: '/index' },
      { path: 'index', name: '首页', component: () => import('@/views/index/index.vue') },
      { path: 'dept', name: '部门管理', component: () => import('@/views/dept/index.vue') },
      { path: 'emp', name: '员工管理', component: () => import('@/views/emp/index.vue') },
      { path: 'clazz', name: '班级管理', component: () => import('@/views/clazz/index.vue') },
      { path: 'stu', name: '学生管理', component: () => import('@/views/stu/index.vue') },
      { path: 'report/log', name: '日志管理', component: () => import('@/views/log/index.vue') },
      { path: 'report/emp', name: '员工报表', component: () => import('@/views/report/emp/index.vue') },
      { path: 'report/stu', name: '学生报表', component: () => import('@/views/report/stu/index.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫：未登录时重定向到登录页
router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  if (to.path === "/login") {
    if (token) {
      return "/index";
    }
    return;
  }
  if (!token) {
    return "/login";
  }
});

export default router
