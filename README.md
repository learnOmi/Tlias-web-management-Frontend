# Tlias 智能学习辅助系统 - 前端

基于 Vue 3 + Vite + Element Plus 构建的企业级学习管理系统前端，涵盖员工管理、学生管理、班级管理、部门管理及数据可视化等完整业务场景。

## 目录

- [项目简介](#项目简介)
- [功能模块](#功能模块)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [架构概览](#架构概览)
- [核心模块详解](#核心模块详解)
- [快速开始](#快速开始)
- [后端接口配置](#后端接口配置)
- [开发规范](#开发规范)
- [构建与部署](#构建与部署)
- [推荐 IDE](#推荐-ide)

---

## 项目简介

Tlias（Training Learning Assistant System）是一个综合培训管理平台，帮助教育机构高效管理员工、学生、班级和部门信息，并提供基于 ECharts 的数据可视化报表。

**核心能力：**

- 多角色权限控制（路由级 + 指令级）
- 完整的 RESTful CRUD 操作（增删改查 + 批量操作）
- 企业级表单验证与动态表单（工作履历动态增行）
- 图片上传（带大小/类型校验）
- 国际化支持（中文/英文一键切换）
- 操作日志审计与性能监控（Core Web Vitals）
- 请求去重、缓存、重试等工程化能力

---

## 功能模块

| 模块       | 路径          | 说明                                               | 权限标识           |
| ---------- | ------------- | -------------------------------------------------- | ------------------ |
| 登录认证   | `/login`      | 用户名密码登录，Token 持久化                       | —                  |
| 首页仪表盘 | `/index`      | 系统概览与快捷入口                                 | —                  |
| 部门管理   | `/dept`       | 部门信息的增删改查                                 | `system:dept:list` |
| 员工管理   | `/emp`        | 员工档案管理（含工作履历），支持搜索/分页/批量删除 | `system:emp:list`  |
| 班级管理   | `/clazz`      | 班级信息维护，含班主任关联                         | `stu:clazz:list`   |
| 学生管理   | `/stu`        | 学生学籍管理，支持违纪扣分                         | `stu:stu:list`     |
| 员工报表   | `/report/emp` | 员工性别分布饼图 + 岗位统计柱状图                  | `report:emp:view`  |
| 学生报表   | `/report/stu` | 学历分布柱状图 + 班级人数柱状图                    | `report:stu:view`  |
| 日志管理   | `/report/log` | 系统操作日志审计（只读）                           | `report:log:view`  |
| 密码修改   | 布局页头部    | 在线修改登录密码                                   | —                  |

---

## 技术栈

| 技术                                                  | 版本    | 说明                                      |
| ----------------------------------------------------- | ------- | ----------------------------------------- |
| [Vue 3](https://vuejs.org/)                           | ^3.2.38 | 渐进式 JavaScript 框架（Composition API） |
| [Vite](https://vitejs.dev/)                           | ^3.0.9  | 下一代前端构建工具（HMR / 按需编译）      |
| [Vue Router](https://router.vuejs.org/)               | ^4.1.5  | Vue.js 官方路由管理器                     |
| [Element Plus](https://element-plus.org/)             | ^2.4.4  | 基于 Vue 3 的组件库                       |
| [Axios](https://axios-http.com/)                      | ^1.7.2  | HTTP 客户端（拦截器 / 取消令牌）          |
| [ECharts](https://echarts.apache.org/)                | ^6.1.0  | 百度开源数据可视化图表库                  |
| [vue-echarts](https://github.com/echarts/vue-echarts) | ^8.0.1  | ECharts 的 Vue 3 封装组件                 |
| [Pinia](https://pinia.vuejs.org/)                     | ^3.x    | Vue 状态管理（支持持久化插件）            |
| [vue-i18n](https://vue-i18n.intlify.dev/)             | ^9.x    | Vue 国际化插件                            |
| [ESLint](https://eslint.org/)                         | ^8.22.0 | 代码质量检查工具                          |
| [Prettier](https://prettier.io/)                      | ^2.7.1  | 代码格式化工具                            |
| [Husky](https://typicode.github.io/husky/)            | —       | Git Hooks 管理                            |
| [Commitlint](https://commitlint.js.org/)              | —       | Git Commit 信息规范校验                   |

---

## 项目结构

```
src/
├── api/                    # 接口请求模块 — 每个业务域一个文件，统一使用封装后的 axios 实例
│   ├── clazz.js            # 班级 CRUD + 下拉列表
│   ├── dept.js             # 部门 CRUD
│   ├── emp.js              # 员工 CRUD + 部门下拉
│   ├── log.js              # 操作日志分页查询
│   ├── login.js            # 登录接口
│   ├── password.js         # 密码修改
│   ├── report.js           # 报表数据接口
│   └── student.js          # 学生 CRUD + 违纪扣分
├── assets/                 # 静态资源（图片、全局样式）
├── components/             # 全局组件
│   ├── common/             #   通用业务组件（ProTable、ProFormDialog、ImageUpload 等）
│   └── ErrorBoundary.vue   #   错误边界组件（捕获子树异常）
├── composables/            # 组合式函数（可复用逻辑）
│   ├── useRequestCache.ts  #   请求缓存 Hook
│   ├── useShortcuts.ts     #   键盘快捷键 Hook
│   └── useTableColumns.ts  #   表格列显隐控制 Hook
├── directives/             # 自定义指令
│   ├── permission.js       #   v-permission — 按钮级权限控制
│   ├── lazyImage.ts        #   v-lazy — 图片懒加载
│   └── role.js             #   v-role — 角色级显示控制
├── locales/                # 国际化翻译文件（zh-CN / en-US）
├── monitor/                # 监控与埋点
│   ├── performance.ts      #   性能指标采集（Core Web Vitals）
│   ├── track.ts            #   行为埋点（页面浏览 + 点击追踪）
│   └── index.ts            #   监控初始化入口
├── router/                 # 路由配置
│   └── index.js            #   路由表 + 全局守卫（鉴权 + 权限）
├── stores/                 # Pinia 状态管理
│   ├── modules/
│   │   ├── app.js          #   应用全局状态（主题/语言/侧边栏/缓存视图）
│   │   ├── dict.js         #   字典数据（岗位/学历/性别映射）
│   │   └── user.js         #   用户状态（Token/角色/权限）
├── types/                  # TypeScript 类型定义
│   └── index.ts            #   所有接口/实体类型
├── utils/                  # 工具函数
│   ├── axios.js            #   Axios 实例封装（拦截器/去重/缓存/重试）
│   ├── errorHandler.js     #   全局错误处理（Vue + Window）
│   ├── logger.ts           #   分级日志工具
│   └── buildInfo.ts        #   构建元信息（版本号/环境/时间）
├── views/                  # 页面组件
│   ├── login/              #   登录页（动画背景 + 表单校验）
│   ├── layout/             #   主布局（顶栏 + 侧边栏 + 内容区）
│   ├── index/              #   首页仪表盘
│   ├── dept/               #   部门管理
│   ├── emp/                #   员工管理 + 员工表单弹窗
│   ├── clazz/              #   班级管理 + 班级表单弹窗
│   ├── stu/                #   学生管理 + 学生表单弹窗
│   ├── log/                #   日志管理（只读）
│   ├── report/             #   报表模块
│   │   ├── emp/            #     员工统计报表
│   │   └── stu/            #     学生统计报表
│   └── error/              #   错误页（403 / 404 / 500）
├── App.vue                 # 根组件
└── main.ts                 # 应用入口（初始化流程）
```

---

## 架构概览

```
┌─────────────────────────────────────────────────────┐
│                    用户浏览器                         │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ 登录页    │  │ 主布局    │  │ 各业务页面        │   │
│  │ /login   │  │ /        │  │ /dept, /emp...  │   │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │
│       │             │                  │              │
│  ┌────▼─────────────▼──────────────────▼─────────┐   │
│  │              Vue Router (路由守卫)              │   │
│  │  • 白名单放行  • Token 校验  • 权限校验          │   │
│  └──────────────────┬────────────────────────────┘   │
│                     │                                 │
│  ┌──────────────────▼────────────────────────────┐   │
│  │              Axios 封装 (utils/axios.js)        │   │
│  │  • 请求去重 (CancelToken)  • 响应缓存           │   │
│  │  • Token 注入        • 全局 Loading            │   │
│  │  • 错误拦截        • 自动重试 (GET)             │   │
│  └──────────────────┬────────────────────────────┘   │
│                     │                                 │
│  ┌──────────────────▼────────────────────────────┐   │
│  │              Pinia Stores                      │   │
│  │  • user (Token/权限)   • app (主题/语言)       │   │
│  │  • dict (字典映射)                            │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  后端 API       │
            │  localhost:8080 │
            └────────────────┘
```

---

## 核心模块详解

> 本节逐一介绍项目中用到的每个模块和技术，帮助你深入理解整体架构。

### 1. Axios 封装 (`src/utils/axios.js`)

项目自研了一个增强版 Axios 实例，封装了以下企业级能力：

| 能力             | 说明                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| **请求去重**     | 使用 `axios.CancelToken`，相同 URL + 参数的并发请求自动取消旧请求，避免重复网络开销              |
| **响应缓存**     | GET 请求开启 `cache: true` 后，响应会被缓存（最多 200 条，5 分钟过期），后续相同请求直接返回缓存 |
| **Token 注入**   | 请求拦截器自动从 Pinia 获取 Token 并附加到请求头（登录页等白名单接口除外）                       |
| **全局 Loading** | 使用 `ElLoading.service` 显示全屏加载遮罩，嵌套并发请求不会闪烁（计数器控制）                    |
| **统一响应处理** | 后端约定 `{ code: 1 }` 为成功，自动解包 `data`；`code !== 1` 时弹出错误提示                      |
| **401 自动登出** | 检测到 401 时清除用户数据并重定向到登录页                                                        |
| **自动重试**     | GET 请求在超时或网络错误时自动重试（最多 2 次，间隔 1 秒），POST/PUT/DELETE 不重试以防幂等性问题 |

**后端响应约定：**

```typescript
// 所有接口统一返回格式
{
  code: 1,        // 1=成功, 0=失败
  msg: "操作成功",  // 提示信息
  data: { ... }   // 业务数据
}
```

**使用方式：**

```javascript
// 所有 API 模块统一导入封装后的实例
import axios from "@/utils/axios";

// 基本用法
export function getEmpList(params) {
  return axios.get("/emps", { params });
}

// 开启缓存
export function getDeptList() {
  return axios.get("/depts", { cache: true });
}
```

### 2. 路由与权限 (`src/router/index.js`)

路由采用 **懒加载**（代码分割）策略，每个页面独立 chunk，首屏仅加载必要代码。

**路由守卫流程：**

```
访问页面
  ├─ 开始 NProgress 进度条
  ├─ 取消所有待处理 HTTP 请求（清理旧路由残留）
  ├─ 白名单判断（/login, /403, /404, /500 无需登录）
  ├─ 已登录用户访问 /login → 重定向到 /index
  ├─ 未登录 → 重定向到 /login
  ├─ 有 meta.permission → 调用 userStore.hasPermission() 校验
  │   └─ 无权限 → 重定向到 /403
  └─ 放行
```

**权限标识约定：**

每个需要权限的路由在 `meta.permission` 中声明权限码，格式为 `模块:资源:操作`：

| 路由          | 权限标识           | 含义         |
| ------------- | ------------------ | ------------ |
| `/dept`       | `system:dept:list` | 部门列表查看 |
| `/emp`        | `system:emp:list`  | 员工列表查看 |
| `/clazz`      | `stu:clazz:list`   | 班级列表查看 |
| `/stu`        | `stu:stu:list`     | 学生列表查看 |
| `/report/log` | `report:log:view`  | 日志查看     |

**路由元字段说明：**

| 字段              | 类型               | 说明                                |
| ----------------- | ------------------ | ----------------------------------- |
| `meta.title`      | string             | 页面标题（自动设置 document.title） |
| `meta.permission` | string \| string[] | 所需权限标识                        |
| `meta.keepAlive`  | boolean            | 是否启用 KeepAlive 缓存             |

### 3. 用户状态管理 (`src/stores/modules/user.js`)

基于 **Pinia** 的用户状态 store，负责管理登录凭证和权限信息：

**存储字段：**

| 字段          | 类型     | 说明                             | 持久化                      |
| ------------- | -------- | -------------------------------- | --------------------------- |
| `token`       | string   | JWT Token                        | localStorage (`tlias-user`) |
| `userInfo`    | object   | `{ id, username, name, avatar }` | ✓                           |
| `roles`       | string[] | 角色数组，如 `['admin']`         | ✓                           |
| `permissions` | string[] | 权限标识数组                     | ✓                           |

**关键方法：**

| 方法            | 参数                                      | 说明                                   |
| --------------- | ----------------------------------------- | -------------------------------------- |
| `setLoginData`  | `{ token, userInfo, roles, permissions }` | 登录成功后批量设置                     |
| `hasPermission` | `string \| string[]`                      | 管理员拥有全部权限；支持单个或数组匹配 |
| `hasRole`       | `string \| string[]`                      | 角色匹配检查                           |
| `logout`        | —                                         | 清除所有数据，跳转登录页               |
| `clearUserData` | —                                         | 接口返回 401 时调用，强制登出          |

**持久化原理：** 使用 `pinia-plugin-persistedstate` 插件，store 数据自动同步到 localStorage，刷新页面后恢复登录态。

### 4. 字典管理 (`src/stores/modules/dict.js`)

字典 Store 统一管理业务中的**枚举值映射**，将数字编码转换为可读文本：

| 字典类型     | 映射关系                                           |
| ------------ | -------------------------------------------------- |
| `emp_job`    | 1=班主任, 2=讲师, 3=学工主管, 4=教研主管, 5=咨询师 |
| `stu_degree` | 1=初中, 2=高中, 3=大专, 4=本科, 5=硕士, 6=博士     |
| `gender`     | 1=男, 2=女                                         |

**使用方式：**

```vue
<!-- 模板中使用 DictTag 组件 -->
<DictTag dict-type="emp_job" :value="row.job" />

<!-- 或直接用字典 store -->
<script setup>
import { useDictStore } from "@/stores/modules/dict";
const dictStore = useDictStore();
const label = dictStore.getDictLabel("emp_job", 1); // "班主任"
</script>
```

> 当前字典为硬编码，预留了 `loadDictFromServer` 接口用于未来从后端动态加载。

### 5. 全局组件 (`src/components/common/`)

项目封装了一套可复用的业务组件，减少样板代码：

#### ProTable — 高级表格

内置搜索表单、工具栏、分页、骨架屏、列显隐控制的完整表格方案：

```vue
<ProTable
  key="emp"
  :request="getEmpList"
  :columns="columns"
  :search-fields="searchFields"
  :toolbar="['add', 'batchDelete']"
  @add="handleAdd"
  @batch-delete="handleBatchDelete"
/>
```

**特性：**

- 搜索区：支持输入框、下拉选择、日期范围
- 工具栏：自定义按钮（新增、批量删除等）
- 列设置：每列可独立开关，偏好存入 localStorage
- 骨架屏：加载中显示占位动画
- 分页：支持 10/20/50/100 条/页切换

#### ProFormDialog — 表单弹窗

封装了弹窗的可见性控制、表单引用、提交校验等逻辑：

```vue
<ProFormDialog
  v-model="visible"
  title="编辑员工"
  :initial-data="currentRow"
  :rules="rules"
  @submit="handleSubmit"
>
  <!-- 表单内容 -->
</ProFormDialog>
```

#### ImageUpload — 图片上传

封装了 Element Plus Upload 组件，对接 `/api/upload` 接口：

```vue
<ImageUpload v-model="form.avatar" :max-size="2" alt="员工头像" />
```

内置校验：图片类型（jpg/png/gif）、文件大小（默认 2MB）。

#### DictTag — 字典标签

将数字编码渲染为彩色 Tag：

```vue
<DictTag dict-type="gender" :value="1" />
<!-- 输出：<el-tag>男</el-tag> -->
```

#### TableSkeleton — 骨架屏

加载中占位组件，支持自定义行列数和高度：

```vue
@TableSkeleton :rows="5" :columns="8" />
```

### 6. 自定义指令 (`src/directives/`)

| 指令           | 用法                                                          | 说明                            |
| -------------- | ------------------------------------------------------------- | ------------------------------- |
| `v-permission` | `<el-button v-permission="'system:emp:add'">新增</el-button>` | 无权限时从 DOM 移除元素         |
| `v-role`       | `<div v-role="'admin'">管理员专属</div>`                      | 角色不匹配时隐藏                |
| `v-lazy`       | `<img v-lazy="imageUrl" />`                                   | IntersectionObserver 懒加载图片 |

### 7. 组合式函数 (`src/composables/`)

| 函数                   | 用途                                          |
| ---------------------- | --------------------------------------------- |
| `useTableColumns(key)` | 表格列显隐控制 + localStorage 持久化          |
| `useShortcuts()`       | 注册键盘快捷键（如 Ctrl+K 聚焦搜索框）        |
| `useRequestCache()`    | 请求缓存 Hook（LRU，最大 200 条，5 分钟过期） |

### 8. 监控与埋点 (`src/monitor/`)

#### 性能监控 (`performance.ts`)

利用浏览器 Performance API 采集 Core Web Vitals 指标：

| 指标                               | 含义             | 采集方式                                       |
| ---------------------------------- | ---------------- | ---------------------------------------------- |
| **FCP** (First Contentful Paint)   | 首次内容绘制时间 | PerformanceObserver `paint`                    |
| **FP** (First Paint)               | 首次绘制时间     | PerformanceObserver `paint`                    |
| **LCP** (Largest Contentful Paint) | 最大内容绘制时间 | PerformanceObserver `largest-contentful-paint` |
| **CLS** (Cumulative Layout Shift)  | 累积布局偏移     | PerformanceObserver `layout-shift`             |
| **TTFB** (Time to First Byte)      | 首字节时间       | Navigation Timing API                          |

生产环境通过 `navigator.sendBeacon` 上报到 `/api/log/track`，不影响页面卸载。

#### 行为埋点 (`track.ts`)

基于 `data-track` 属性自动追踪点击事件，支持批量上报（最多 10 条/批，5 秒节流）：

```html
<button data-track="click:btn_login">登录</button>
```

### 9. 国际化 (`src/locales/`)

使用 `vue-i18n` 实现中英文切换，语言偏好持久化到 localStorage。覆盖 12 个命名空间：

`common` · `login` · `menu` · `header` · `dept` · `emp` · `clazz` · `student` · `report` · `error` · `password` · `layout`

切换方式：布局页头部下拉菜单，即时生效。

### 10. 全局错误处理 (`src/utils/errorHandler.js`)

注册多层错误捕获，防止未处理异常导致白屏：

```
┌──────────────────────────────────────┐
│           错误捕获层级                │
├──────────────────────────────────────┤
│ 1. app.config.errorHandler           │  ← Vue 组件内部错误
│ 2. window.onerror (资源加载)          │  ← img/script/link 加载失败
│ 3. window.onunhandledrejection        │  ← Promise 未 catch
└──────────────────┬───────────────────┘
                   ▼
          聚合上报到 /api/log/report
```

---

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```sh
npm install
```

### 启动开发服务器

```sh
npm run dev
```

默认运行在 `http://localhost:5173`。

### 构建生产版本

```sh
npm run build          # 生产环境构建
npm run build:dev      # 开发环境构建
npm run build:test     # 测试环境构建
npm run build:staging  # 预发布环境构建
```

### 预览生产构建

```sh
npm run preview
```

### 代码检查与修复

```sh
npm run lint           # 检查并自动修复
```

---

## 后端接口配置

项目通过 Vite 开发服务器代理将 `/api` 前缀的请求转发到后端。

**默认配置：**

| 配置项   | 值                      |
| -------- | ----------------------- |
| 代理目标 | `http://localhost:8080` |
| 代理路径 | `/api`                  |
| 路径重写 | 去掉 `/api` 前缀        |

例如前端请求 `GET /api/emps?page=1&pageSize=10` 会被转发到后端 `GET http://localhost:8080/emps?page=1&pageSize=10`。

如需修改后端地址，请编辑 [vite.config.ts](vite.config.ts)：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-host:port',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

**环境变量：** 项目通过 `.env.*` 文件管理不同环境的配置（见下方构建部分）。

---

## 开发规范

### 路径别名

项目已配置 `@` 别名指向 `src` 目录：

```javascript
import xxx from "@/views/xxx"; // 等同于 import xxx from 'src/views/xxx'
```

### 命名规范

| 类型       | 规范             | 示例                   |
| ---------- | ---------------- | ---------------------- |
| 文件名     | kebab-case       | `emp-form-dialog.vue`  |
| 组件名     | PascalCase       | `EmpFormDialog`        |
| 路由名     | kebab-case       | `emp-mgmt`             |
| Store 变量 | camelCase        | `userStore`            |
| API 函数   | camelCase + 动词 | `getEmpList`, `addEmp` |
| 权限标识   | kebab 三段式     | `system:emp:list`      |

### API 函数命名约定

所有 API 函数遵循统一的动词前缀命名：

| 操作     | 命名模式        | 示例              |
| -------- | --------------- | ----------------- |
| 查询列表 | `getXxxList`    | `getEmpList`      |
| 查询详情 | `getXxxById`    | `getDeptById`     |
| 新增     | `addXxx`        | `addEmp`          |
| 修改     | `updateXxx`     | `updateEmp`       |
| 删除     | `deleteXxx`     | `deleteEmp`       |
| 下拉选项 | `getAllXxxList` | `getAllClazzList` |

---

## 构建与部署

### 环境变量

| 文件               | 用途         |
| ------------------ | ------------ |
| `.env.development` | 本地开发环境 |
| `.env.production`  | 生产环境     |
| `.env.test`        | 测试环境     |
| `.env.staging`     | 预发布环境   |

| 变量                | 说明          |
| ------------------- | ------------- |
| `VITE_APP_TITLE`    | 应用标题      |
| `VITE_API_BASE_URL` | API 基础路径  |
| `VITE_APP_ENV`      | 当前环境标识  |
| `VITE_APP_VERSION`  | 版本号        |
| `VITE_ENABLE_MOCK`  | 是否启用 Mock |

### 构建优化

- **代码分割**：Vue / Element Plus / ECharts / i18n 分离为独立 chunk
- **gzip 压缩**：大于 10KB 的资源自动压缩
- **Tree Shaking**：移除未使用的代码
- **Source Map**：生产环境关闭

---

## 推荐 IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（请禁用 Vetur）
