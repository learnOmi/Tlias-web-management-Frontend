# Tlias 智能学习管理系统 - 前端

基于 Vue 3 + Vite + Element Plus 构建的现代化管理系统前端项目。

## 项目简介

Tlias 是一个集员工管理、学生管理、部门管理、班级管理于一体的综合管理平台，提供数据可视化报表和操作日志功能。

## 功能模块

- **登录认证**：基于 Token 的用户身份验证
- **首页仪表盘**：系统概览与数据统计
- **部门管理**：部门信息的增删改查
- **员工管理**：员工档案管理与信息维护
- **班级管理**：班级信息的创建与管理
- **学生管理**：学生信息管理与学籍维护
- **日志管理**：系统操作日志记录与查询
- **报表统计**：
  - 员工报表（基于 ECharts 的数据可视化）
  - 学生报表（基于 ECharts 的数据可视化）

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | ^3.2.38 | 渐进式 JavaScript 框架 |
| Vite | ^3.0.9 | 下一代前端构建工具 |
| Vue Router | ^4.1.5 | Vue.js 官方路由 |
| Element Plus | ^2.4.4 | 基于 Vue 3 的组件库 |
| Axios | ^1.7.2 | HTTP 客户端 |
| ECharts | ^6.1.0 | 数据可视化图表库 |
| vue-echarts | ^8.0.1 | ECharts 的 Vue 封装 |
| ESLint | ^8.22.0 | 代码检查工具 |
| Prettier | ^2.7.1 | 代码格式化工具 |

## 项目结构

```
src/
├── api/              # 接口请求模块
│   ├── clazz.js      # 班级相关接口
│   ├── dept.js       # 部门相关接口
│   ├── emp.js        # 员工相关接口
│   ├── log.js        # 日志相关接口
│   ├── login.js      # 登录相关接口
│   ├── password.js   # 密码相关接口
│   ├── report.js     # 报表相关接口
│   └── student.js    # 学生相关接口
├── assets/           # 静态资源
│   ├── bg1.jpg
│   ├── index.png
│   └── main.css
├── router/           # 路由配置
│   └── index.js
├── utils/            # 工具函数
│   └── axios.js      # Axios 封装
├── views/            # 页面组件
│   ├── clazz/        # 班级管理
│   ├── dept/         # 部门管理
│   ├── emp/          # 员工管理
│   ├── index/        # 首页
│   ├── layout/       # 布局组件
│   ├── log/          # 日志管理
│   ├── login/        # 登录页
│   ├── report/       # 报表模块
│   │   ├── emp/      # 员工报表
│   │   └── stu/      # 学生报表
│   └── stu/          # 学生管理
├── App.vue           # 根组件
└── main.js           # 入口文件
```

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

### 构建生产版本

```sh
npm run build
```

### 预览生产构建

```sh
npm run preview
```

### 代码检查与修复

```sh
npm run lint
```

## 后端接口配置

项目通过 Vite 代理将 `/api` 前缀的请求转发到后端服务。

**默认配置**：
- 代理目标：`http://localhost:8080`
- 代理前缀：`/api`

如需修改，请编辑 [vite.config.js](file:///workspace/vite.config.js)：

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

## 开发说明

### 路径别名

项目已配置 `@` 别名指向 `src` 目录：

```javascript
import xxx from '@/views/xxx'  // 等同于 src/views/xxx
```

### 路由守卫

全局路由守卫已实现，未登录用户会自动重定向到登录页。Token 存储在 `localStorage` 中，键名为 `token`。

### 组件库

- 全局注册 Element Plus 组件
- 全局注册 Element Plus 图标库
- 中文语言包已配置

## 推荐 IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（请禁用 Vetur）
