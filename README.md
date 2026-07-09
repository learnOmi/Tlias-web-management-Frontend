# Tlias Intelligent Learning Assistant System - Frontend

An enterprise-level learning management system frontend built with Vue 3 + Vite + Element Plus, covering complete business scenarios including employee management, student management, class management, department management, and data visualization.

## Table of Contents

- [Project Overview](#project-overview)
- [Feature Modules](#feature-modules)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Core Module Details](#core-module-details)
- [Quick Start](#quick-start)
- [Backend API Configuration](#backend-api-configuration)
- [Development Guidelines](#development-guidelines)
- [Build & Deployment](#build--deployment)
- [Recommended IDE](#recommended-ide)

---

## Project Overview

Tlias (Training Learning Assistant System) is a comprehensive training management platform that helps educational institutions efficiently manage employee, student, class, and department information, and provides data visualization reports based on ECharts.

**Core Capabilities:**

- Multi-role permission control (route-level + directive-level)
- Complete RESTful CRUD operations (create, read, update, delete + batch operations)
- Enterprise-grade form validation and dynamic forms (work experience dynamic row addition)
- Image upload (with size/type validation)
- Internationalization support (Chinese/English one-click switch)
- Operation log auditing and performance monitoring (Core Web Vitals)
- Engineering capabilities such as request deduplication using `AbortController`, caching, and retry

---

## Feature Modules

| Module          | Path          | Description                                                                                      | Permission         |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| Login           | `/login`      | Username/password login with Token persistence                                                   | —                  |
| Dashboard       | `/index`      | System overview and quick access                                                                 | —                  |
| Department Mgmt | `/dept`       | CRUD for department information                                                                  | `system:dept:list` |
| Employee Mgmt   | `/emp`        | Employee profile management (including work experience), supports search/pagination/batch delete | `system:emp:list`  |
| Class Mgmt      | `/clazz`      | Class information maintenance with homeroom teacher association                                  | `stu:clazz:list`   |
| Student Mgmt    | `/stu`        | Student enrollment management with violation points deduction                                    | `stu:stu:list`     |
| Employee Report | `/report/emp` | Gender distribution pie chart + position statistics bar chart                                    | `report:emp:view`  |
| Student Report  | `/report/stu` | Education level distribution bar chart + class enrollment bar chart                              | `report:stu:view`  |
| Log Management  | `/report/log` | System operation log audit (read-only)                                                           | `report:log:view`  |
| Password Change | Header layout | Online password modification                                                                     | —                  |

---

## Technology Stack

| Technology                                                                  | Version | Description                                                       |
| --------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------- |
| [Vue 3](https://vuejs.org/)                                                 | ^3.2.38 | Progressive JavaScript framework (Composition API)                |
| [Vite](https://vitejs.dev/)                                                 | ^3.0.9  | Next-generation frontend build tool (HMR / on-demand compilation) |
| [Vue Router](https://router.vuejs.org/)                                     | ^4.1.5  | Vue.js official router manager                                    |
| [Element Plus](https://element-plus.org/)                                   | ^2.4.4  | Vue 3-based component library                                     |
| [Axios](https://axios-http.com/)                                            | ^1.7.2  | HTTP client (interceptors / AbortController)                      |
| [ECharts](https://echarts.apache.org/)                                      | ^6.1.0  | Baidu open-source data visualization chart library                |
| [vue-echarts](https://github.com/echarts/vue-echarts)                       | ^8.0.1  | Vue 3 wrapper component for ECharts                               |
| [Pinia](https://pinia.vuejs.org/)                                           | ^3.0.4  | Vue state management (with `pinia-plugin-persistedstate`)         |
| [vue-i18n](https://vue-i18n.intlify.dev/)                                   | ^9.14.5 | Vue internationalization plugin                                   |
| [NProgress](https://github.com/rstacruz/nprogress)                          | ^0.2.0  | Page loading progress bar                                         |
| [ESLint](https://eslint.org/)                                               | ^8.22.0 | Code quality checking tool                                        |
| [Prettier](https://prettier.io/)                                            | ^2.7.1  | Code formatting tool                                              |
| [Husky](https://typicode.github.io/husky/)                                  | ^9.1.7  | Git Hooks management                                              |
| [Commitlint](https://commitlint.js.org/)                                    | ^21.2.0 | Git Commit message specification validation                       |
| [lint-staged](https://github.com/okonet/lint-staged)                        | ^17.0.8 | Run linters on staged git files                                   |
| [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer) | ^7.0.1  | Bundle size visualization                                         |

---

## Project Structure

```
src/
├── api/                    # API request modules — one file per business domain, using wrapped axios instance
│   ├── clazz.js            # Class CRUD + dropdown options
│   ├── dept.js             # Department CRUD
│   ├── emp.js              # Employee CRUD + department dropdown
│   ├── log.js              # Operation log pagination query
│   ├── login.js            # Login API
│   ├── password.js         # Password change
│   ├── report.js           # Report data API
│   └── student.js          # Student CRUD + violation points
├── assets/                 # Static assets (images, global styles)
├── components/             # Global components
│   ├── common/             #   Common business components
│   │   ├── ProTable.vue    #     Advanced table with search/toolbar/pagination/skeleton
│   │   ├── ProFormDialog.vue # Form dialog with validation and initial data sync
│   │   ├── ImageUpload.vue #   Image upload with size/type validation
│   │   ├── DictTag.vue     #   Dictionary tag component
│   │   ├── PageHeader.vue  #   Page header component
│   │   ├── TableSkeleton.vue # Loading skeleton for tables
│   │   └── index.ts        #   Component registration
│   └── ErrorBoundary.vue   # Error boundary component (catches subtree exceptions)
├── composables/            # Composables (reusable logic)
│   ├── useRequestCache.ts  # Request cache hook (LRU, max 200 entries, 5-minute TTL)
│   ├── useShortcuts.ts     # Keyboard shortcuts hook
│   └── useTableColumns.ts  # Table column visibility control hook with localStorage persistence
├── directives/             # Custom directives
│   ├── permission.js       # v-permission — button-level permission control (removes element)
│   ├── lazyImage.ts        # v-lazy — IntersectionObserver-based image lazy loading
│   ├── role.js             # v-role — role-level display control (removes element)
│   └── index.ts            # Directive registration
├── locales/                # Internationalization translation files
│   ├── index.ts            # i18n configuration and setLocale function
│   ├── zh-CN.ts            # Chinese translations (12 namespaces)
│   └── en-US.ts            # English translations
├── monitor/                # Monitoring and tracking
│   ├── performance.ts      # Performance metric collection (Core Web Vitals)
│   ├── track.ts            # Behavior tracking (page view + click tracking)
│   └── index.ts            # Monitoring initialization and event listeners
├── router/                 # Route configuration
│   └── index.js            # Route table + global guards (authentication + permission)
├── stores/                 # Pinia state management
│   ├── index.js            # Pinia initialization with persistence plugin
│   └── modules/
│       ├── app.js          # App global state (theme/language/sidebar/cached views/global loading)
│       ├── dict.js         # Dictionary data (position/education/gender mapping)
│       └── user.js         # User state (Token/roles/permissions)
├── types/                  # TypeScript type definitions
│   └── index.ts            # All API/entity types
├── utils/                  # Utility functions
│   ├── axios.js            # Axios instance wrapper (interceptors/AbortController/cache/retry)
│   ├── errorHandler.js     # Global error handling (5 error types: VUE/RESOURCE/PROMISE/NETWORK/JS)
│   ├── logger.ts           # Graded logging utility
│   └── buildInfo.ts        # Build metadata (version/environment/time)
├── views/                  # Page components
│   ├── login/              # Login page (animated background + form validation)
│   ├── layout/             # Main layout (top bar + sidebar + content area + PasswordDialog)
│   ├── index/              # Dashboard homepage
│   ├── dept/               # Department management
│   ├── emp/                # Employee management + EmpFormDialog
│   ├── clazz/              # Class management + ClazzFormDialog
│   ├── stu/                # Student management + StuFormDialog
│   ├── log/                # Log management (read-only)
│   ├── report/             # Report module
│   │   ├── emp/            # Employee statistics report
│   │   └── stu/            # Student statistics report
│   └── error/              # Error pages (403 / 404 / 500)
├── App.vue                 # Root component
├── main.ts                 # App entry point (initialization flow)
└── vite-env.d.ts           # Vite environment type definitions
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    User Browser                     │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Login   │  │  Layout  │  │  Business Pages  │   │
│  │ /login   │  │ /        │  │ /dept, /emp...  │   │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │
│       │             │                  │              │
│  ┌────▼─────────────▼──────────────────▼─────────┐   │
│  │              Vue Router (Route Guards)          │   │
│  │  • Whitelist bypass  • Token validation       │   │
│  │  • Permission check                           │   │
│  └──────────────────┬────────────────────────────┘   │
│                     │                                 │
│  ┌──────────────────▼────────────────────────────┐   │
│  │              Axios Wrapper (utils/axios.js)     │   │
│  │  • Request deduplication (AbortController)    │   │
│  │  • Response caching (LRU Map)                 │   │
│  │  • Token injection (header: token)            │   │
│  │  • Global Loading (counter-controlled)        │   │
│  │  • Error interception • Auto retry (GET)      │   │
│  └──────────────────┬────────────────────────────┘   │
│                     │                                 │
│  ┌──────────────────▼────────────────────────────┐   │
│  │              Pinia Stores                      │   │
│  │  • user (Token/permissions/persistence)       │   │
│  │  • app (theme/language/sidebar/loading)       │   │
│  │  • dict (dictionary mapping)                  │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  Backend API   │
            │  localhost:8080│
            └────────────────┘
```

---

## Core Module Details

> This section introduces each module and technology used in the project based on actual code implementation.

### 1. Axios Wrapper (`src/utils/axios.js`)

The project has developed an enhanced Axios instance with the following enterprise-grade capabilities:

| Feature                       | Implementation                                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Request Deduplication**     | Uses `AbortController` (not `axios.CancelToken`), auto-cancels old concurrent requests with the same URL + parameters |
| **Response Caching**          | GET requests with `cache: true` are cached in a Map (max 200 entries, 5-minute TTL, LRU eviction)                     |
| **Token Injection**           | Request interceptor automatically fetches Token from Pinia and sets `config.headers["token"]` (not `Authorization`)   |
| **Global Loading**            | Uses `ElLoading.service` with counter-controlled display, nested concurrent requests don't flicker                    |
| **Unified Response Handling** | Backend convention `{ code: 1 }` for success, auto-unwraps response; shows error notification when `code !== 1`       |
| **401 Auto Logout**           | Clears user data and redirects to `/login` when 401 is detected                                                       |
| **Auto Retry**                | GET requests auto-retry on timeout or network errors (max 2 times, 1-second interval), POST/PUT/DELETE don't retry    |

**Backend Response Convention:**

```typescript
{
  code: 1,        // 1=success, 0=failed
  msg: "Operation successful",
  data: { ... }   // Business data
}
```

**Usage:**

```javascript
import axios from "@/utils/axios";

export function getEmpList(params) {
  return axios.get("/emps", { params });
}

export function getDeptList() {
  return axios.get("/depts", { cache: true });
}
```

**Exported Functions:**

| Function              | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `cancelAllRequests()` | Aborts all pending requests (called during route navigation) |
| `showLoading(text)`   | Shows global loading mask                                    |
| `hideLoading()`       | Hides global loading mask                                    |
| `clearCache(pattern)` | Clears cached responses (optional pattern filter)            |

### 2. Routing & Permission (`src/router/index.js`)

Routes use **lazy loading** (code splitting) strategy. The router uses `createWebHistory` mode.

**Route Guard Flow:**

```
Access Page
  ├─ Start NProgress bar
  ├─ Cancel all pending HTTP requests (cancelAllRequests)
  ├─ Whitelist check (/login, /403, /404, /500 don't require login)
  ├─ Logged-in user accessing /login → redirect to /index
  ├─ Not logged in → redirect to /login
  ├─ Has meta.permission → call userStore.hasPermission() to verify
  │   └─ No permission → redirect to /403
  └─ Allow access
```

**Permission Code Convention:**

Each route requiring permission declares a permission code in `meta.permission`, format is `module:resource:operation`:

| Route         | Permission         | Description          |
| ------------- | ------------------ | -------------------- |
| `/dept`       | `system:dept:list` | Department list view |
| `/emp`        | `system:emp:list`  | Employee list view   |
| `/clazz`      | `stu:clazz:list`   | Class list view      |
| `/stu`        | `stu:stu:list`     | Student list view    |
| `/report/log` | `report:log:view`  | Log view             |

**Route Meta Fields:**

| Field             | Type               | Description                                    |
| ----------------- | ------------------ | ---------------------------------------------- |
| `meta.title`      | string             | Page title (automatically sets document.title) |
| `meta.permission` | string \| string[] | Required permission codes                      |
| `meta.keepAlive`  | boolean            | Whether to enable KeepAlive caching            |

### 3. User State Management (`src/stores/modules/user.js`)

Pinia-based user state store with `pinia-plugin-persistedstate` for localStorage persistence.

**Stored Fields:**

| Field         | Type     | Description                      | Persistence                 |
| ------------- | -------- | -------------------------------- | --------------------------- |
| `token`       | string   | JWT Token                        | localStorage (`tlias-user`) |
| `userInfo`    | object   | `{ id, username, name, avatar }` | ✓                           |
| `roles`       | string[] | Role array, e.g., `['admin']`    | ✓                           |
| `permissions` | string[] | Permission code array            | ✓                           |

**Computed Properties:**

| Property      | Type    | Description                     |
| ------------- | ------- | ------------------------------- |
| `isLoggedIn`  | boolean | Whether user is authenticated   |
| `isAdmin`     | boolean | Whether user has 'admin' role   |
| `displayName` | string  | Display name (name or username) |

**Key Methods:**

| Method          | Parameters                                | Description                                                  |
| --------------- | ----------------------------------------- | ------------------------------------------------------------ |
| `setLoginData`  | `{ token, userInfo, roles, permissions }` | Batch set after login success                                |
| `hasPermission` | `string \| string[]`                      | Admin has all permissions; supports single or array matching |
| `hasRole`       | `string \| string[]`                      | Role matching check                                          |
| `logout`        | `skipMessage?: boolean`                   | Clear all data, redirect to login page                       |
| `clearUserData` | —                                         | Called when API returns 401, force logout                    |

### 4. App State Management (`src/stores/modules/app.js`)

Manages global application state with persistence.

**Stored Fields:**

| Field               | Type     | Description                        | Persistence                |
| ------------------- | -------- | ---------------------------------- | -------------------------- |
| `sidebarCollapsed`  | boolean  | Whether sidebar is collapsed       | localStorage (`tlias-app`) |
| `theme`             | string   | Current theme (`light`/`dark`)     | ✓                          |
| `language`          | string   | Current language (`zh-CN`/`en-US`) | ✓                          |
| `globalLoading`     | boolean  | Global loading state               | —                          |
| `globalLoadingText` | string   | Global loading text                | —                          |
| `pageTitle`         | string   | Page title                         | —                          |
| `cachedViews`       | string[] | KeepAlive cached route names       | —                          |

**Key Methods:**

| Method                       | Description                       |
| ---------------------------- | --------------------------------- |
| `toggleSidebar()`            | Toggles sidebar collapse state    |
| `toggleTheme()`              | Switches between light/dark theme |
| `setLanguage(lang)`          | Sets language and syncs with i18n |
| `addCachedView(viewName)`    | Adds route to KeepAlive cache     |
| `removeCachedView(viewName)` | Removes route from cache          |
| `clearCachedViews()`         | Clears all cached views           |

### 5. Dictionary Management (`src/stores/modules/dict.js`)

Dictionary Store centrally manages **enum value mappings** with persistence.

**Dictionary Types:**

| Type         | Mapping                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| `emp_job`    | 1=Homeroom Teacher, 2=Lecturer, 3=Student Affairs Supervisor, 4=Teaching Research Supervisor, 5=Consultant |
| `stu_degree` | 1=Junior High, 2=Senior High, 3=College, 4=Bachelor, 5=Master, 6=Doctor                                    |
| `gender`     | 1=Male, 2=Female                                                                                           |

**Key Methods:**

| Method                      | Parameters      | Description                                    |
| --------------------------- | --------------- | ---------------------------------------------- | ---------------------------- |
| `getDictByType(type)`       | `string`        | Returns dictionary list by type                |
| `getDictLabel(type, value)` | `string, number | string`                                        | Returns label for a value    |
| `getDictItem(type, value)`  | `string, number | string`                                        | Returns full dictionary item |
| `loadDictFromServer()`      | —               | Reserved method for future backend integration |

### 6. Global Components (`src/components/common/`)

#### ProTable — Advanced Table

Complete table solution with built-in search form, toolbar, pagination, skeleton screen, and column visibility control.

**Props:**

| Prop                    | Type           | Default | Description                           |
| ----------------------- | -------------- | ------- | ------------------------------------- |
| `loading`               | boolean        | false   | Loading state                         |
| `data`                  | array          | []      | Table data                            |
| `total`                 | number         | 0       | Total records for pagination          |
| `page`                  | number         | 1       | Current page (semi-controlled)        |
| `pageSize`              | number         | 10      | Items per page (semi-controlled)      |
| `searchColumns`         | array          | []      | Search field configuration            |
| `showSearch`            | boolean        | true    | Show search area                      |
| `selectable`            | boolean        | false   | Show selection column                 |
| `addVisible`            | boolean        | false   | Show add button                       |
| `batchDeleteVisible`    | boolean        | false   | Show batch delete button              |
| `actionWidth`           | number\|string | 200     | Width of action column                |
| `columns`               | array          | []      | Column configuration                  |
| `columnKey`             | string         | ""      | Key for column visibility persistence |
| `columnSettingsVisible` | boolean        | false   | Show column settings dropdown         |
| `showSkeleton`          | boolean        | false   | Show skeleton loader                  |
| `skeletonRows`          | number         | 5       | Number of skeleton rows               |

**Events:**

| Event         | Parameters                  | Description                 |
| ------------- | --------------------------- | --------------------------- |
| `search`      | `form: Record<string, any>` | Emitted on search           |
| `reset`       | —                           | Emitted on reset            |
| `pageChange`  | `page: number`              | Emitted on page change      |
| `sizeChange`  | `size: number`              | Emitted on page size change |
| `add`         | —                           | Emitted on add button click |
| `batchDelete` | `ids: number[]`             | Emitted on batch delete     |

**Slots:**

| Slot            | Description                        |
| --------------- | ---------------------------------- |
| `search`        | Custom search area                 |
| `search-form`   | Custom search form items           |
| `toolbar-left`  | Custom toolbar left area           |
| `toolbar-right` | Custom toolbar right area          |
| `action`        | Action column content              |
| `column-[prop]` | Custom column content by prop name |

**Usage:**

```vue
<ProTable
  :loading="loading"
  :data="tableData"
  :total="total"
  :page="page"
  :page-size="pageSize"
  :search-columns="searchColumns"
  :columns="columns"
  :selectable="true"
  :add-visible="true"
  :batch-delete-visible="true"
  :column-key="'emp-table'"
  :column-settings-visible="true"
  @search="handleSearch"
  @page-change="handlePageChange"
  @size-change="handleSizeChange"
  @add="handleAdd"
  @batch-delete="handleBatchDelete"
>
  <template #action="{ row }">
    <el-button size="small" @click="handleEdit(row)">Edit</el-button>
    <el-button size="small" type="danger" @click="handleDelete(row)">Delete</el-button>
  </template>
</ProTable>
```

#### ProFormDialog — Form Dialog

Encapsulates dialog visibility control, form reference, submit validation logic.

**Props:**

| Prop            | Type           | Default | Description                 |
| --------------- | -------------- | ------- | --------------------------- |
| `modelValue`    | boolean        | —       | Dialog visibility (v-model) |
| `title`         | string         | ""      | Dialog title                |
| `width`         | string\|number | "600px" | Dialog width                |
| `labelWidth`    | string         | "100px" | Form label width            |
| `rules`         | FormRules      | {}      | Form validation rules       |
| `initialData`   | Record         | {}      | Initial form data           |
| `submitLoading` | boolean        | false   | Submit button loading state |

**Events:**

| Event               | Parameters                      | Description                |
| ------------------- | ------------------------------- | -------------------------- |
| `update:modelValue` | `val: boolean`                  | Emitted when dialog closes |
| `submit`            | `formData: Record<string, any>` | Emitted on valid submit    |

**Exposed Methods:**

| Method        | Description                 |
| ------------- | --------------------------- |
| `resetForm()` | Resets form to initial data |

**Usage:**

```vue
<ProFormDialog
  v-model="visible"
  title="Edit Employee"
  :rules="rules"
  :initial-data="currentRow"
  @submit="handleSubmit"
>
  <el-form-item label="Name" prop="name">
    <el-input v-model="form.name" />
  </el-form-item>
</ProFormDialog>
```

#### ImageUpload — Image Upload

Encapsulates Element Plus Upload component, integrates with `/api/upload` endpoint. Automatically injects Token into upload headers.

**Props:**

| Prop          | Type           | Default    | Description          |
| ------------- | -------------- | ---------- | -------------------- |
| `modelValue`  | string         | ""         | Image URL (v-model)  |
| `maxSize`     | number         | 2          | Max file size in MB  |
| `alt`         | string         | ""         | Alt text for preview |
| `placeholder` | string         | "上传图片" | Placeholder text     |
| `width`       | number\|string | 100        | Preview width in px  |
| `height`      | number\|string | 100        | Preview height in px |

**Events:**

| Event               | Parameters    | Description               |
| ------------------- | ------------- | ------------------------- |
| `update:modelValue` | `val: string` | Emitted on upload success |
| `change`            | `url: string` | Emitted on upload success |

#### DictTag — Dictionary Tag

Renders numeric codes as colored Tags.

**Props:**

| Prop       | Type           | Description      |
| ---------- | -------------- | ---------------- |
| `dictType` | string         | Dictionary type  |
| `value`    | number\|string | Dictionary value |

**Usage:**

```vue
<DictTag dict-type="gender" :value="1" />
<!-- Output: <el-tag>Male</el-tag> -->
```

#### TableSkeleton — Skeleton Screen

Loading placeholder component with customizable rows, columns, and height. Includes shimmer animation effect.

**Props:**

| Prop           | Type     | Default | Description                                                     |
| -------------- | -------- | ------- | --------------------------------------------------------------- |
| `rows`         | number   | 5       | Number of skeleton rows                                         |
| `columns`      | number   | 4       | Number of columns per row                                       |
| `rowHeight`    | number   | 48      | Height of each row                                              |
| `columnWidths` | string[] | []      | Custom width for each column (e.g., `['100px', '20%', 'auto']`) |

#### PageHeader — Page Header

Page header component with title, description, back button, and extra slot.

**Props:**

| Prop          | Type    | Default | Description                                  |
| ------------- | ------- | ------- | -------------------------------------------- |
| `title`       | string  | —       | Page title                                   |
| `description` | string  | ""      | Page description                             |
| `showBack`    | boolean | false   | Show back button                             |
| `backPath`    | string  | ""      | Custom back path (defaults to router.back()) |

**Slots:**

| Slot    | Description                     |
| ------- | ------------------------------- |
| `extra` | Extra content on the right side |

### 7. Custom Directives (`src/directives/`)

| Directive      | Usage                                                        | Description                                      |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| `v-permission` | `<el-button v-permission="'system:emp:add'">Add</el-button>` | Removes element from DOM when no permission      |
| `v-role`       | `<div v-role="'admin'">Admin Only</div>`                     | Removes element from DOM when role doesn't match |
| `v-lazy`       | `<img v-lazy="imageUrl" />`                                  | IntersectionObserver-based image lazy loading    |

### 8. Composables (`src/composables/`)

| Function                   | Purpose                                                                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `useTableColumns(options)` | Table column visibility control + localStorage persistence, returns `{ columns, visibleColumns, toggleColumn, resetColumns, setColumnWidth }` |
| `useShortcuts()`           | Register keyboard shortcuts                                                                                                                   |
| `useRequestCache()`        | Request cache hook (LRU, max 200 entries, 5-minute TTL)                                                                                       |

**useTableColumns Options:**

| Option           | Type           | Description                         |
| ---------------- | -------------- | ----------------------------------- |
| `key`            | string         | Unique storage key for localStorage |
| `defaultColumns` | ColumnConfig[] | Default column configuration        |

**useTableColumns Return Value:**

| Property/Method               | Type     | Description                      |
| ----------------------------- | -------- | -------------------------------- |
| `columns`                     | ref      | Full column configuration        |
| `visibleColumns`              | ref      | Visible columns only             |
| `toggleColumn(prop)`          | function | Toggle column visibility by prop |
| `resetColumns()`              | function | Reset to default configuration   |
| `setColumnWidth(prop, width)` | function | Set width for specific column    |

### 9. Monitoring & Tracking (`src/monitor/`)

#### Performance Monitoring (`performance.ts`)

Uses browser Performance API to collect Core Web Vitals metrics:

| Metric                             | Description                | Collection Method                              |
| ---------------------------------- | -------------------------- | ---------------------------------------------- |
| **FCP** (First Contentful Paint)   | First content paint time   | PerformanceObserver `paint`                    |
| **FP** (First Paint)               | First paint time           | PerformanceObserver `paint`                    |
| **LCP** (Largest Contentful Paint) | Largest content paint time | PerformanceObserver `largest-contentful-paint` |
| **CLS** (Cumulative Layout Shift)  | Cumulative layout shift    | PerformanceObserver `layout-shift`             |
| **TTFB** (Time to First Byte)      | Time to first byte         | Navigation Timing API                          |

Production environment reports via `navigator.sendBeacon` to `/api/log/track`.

#### Behavior Tracking (`track.ts`)

Auto-tracks click events based on `data-track` attribute, supports batch reporting (max 10 items/batch, 5-second throttle):

```html
<button data-track="click:btn_login">Login</button>
```

### 10. Internationalization (`src/locales/`)

Uses `vue-i18n` v9 (Composition API mode) to implement Chinese/English switching, language preference persisted to localStorage via App store.

**Namespaces:** `common` · `login` · `menu` · `header` · `dept` · `emp` · `clazz` · `student` · `report` · `error` · `password` · `layout`

**Configuration:**

```typescript
const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  fallbackLocale: "zh-CN",
  globalInjection: true,
});
```

### 11. Global Error Handling (`src/utils/errorHandler.js`)

Registers 5-layer error capture:

```
┌──────────────────────────────────────┐
│           Error Capture Layers       │
├──────────────────────────────────────┤
│ 1. app.config.errorHandler           │  ← Vue component internal errors (type: VUE)
│ 2. window.onerror (resource)         │  ← img/script/link loading failures (type: RESOURCE)
│ 3. window.onerror (JS)               │  ← Global JavaScript errors (type: JS)
│ 4. window.onunhandledrejection       │  ← Promise unhandled rejection (type: PROMISE)
│ 5. Network errors (Axios interceptor)│  ← HTTP request failures (type: NETWORK)
└──────────────────┬───────────────────┘
                   ▼
          Aggregate and report to /api/log/report (TODO)
```

**Error Reporting:** Configured with throttle (5000ms), but backend integration is still `TODO` — currently only logs to console in development.

---

## Quick Start

### Environment Requirements

- Node.js >= 14.0.0
- npm >= 6.0.0

### Install Dependencies

```sh
npm install
```

### Start Development Server

```sh
npm run dev
```

Runs on `http://localhost:5173` by default.

### Build Commands

```sh
npm run build          # Production build (same as build:prod)
npm run build:dev      # Development build
npm run build:test     # Test environment build
npm run build:staging  # Staging environment build
npm run build:prod     # Production environment build
```

### Preview Production Build

```sh
npm run preview
```

### Code Lint & Fix

```sh
npm run lint           # Check and auto-fix ESLint issues
npm run type-check     # TypeScript type checking
```

### Git Commit with Commitizen

```sh
npm run commit         # Interactive commit message generator
```

---

## Backend API Configuration

The project uses Vite dev server proxy to forward requests with `/api` prefix to the backend.

**Default Configuration (vite.config.ts):**

| Config       | Value                   |
| ------------ | ----------------------- |
| Proxy Target | `http://localhost:8080` |
| Proxy Path   | `/api`                  |
| Path Rewrite | Remove `/api` prefix    |
| Server Host  | `0.0.0.0`               |
| Server Port  | `5173`                  |
| CORS         | Enabled                 |
| Auto Open    | Disabled                |

**Example:** Frontend request `GET /api/emps?page=1&pageSize=10` → Backend `GET http://localhost:8080/emps?page=1&pageSize=10`

**To modify the backend address:**

```typescript
// vite.config.ts
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

---

## Development Guidelines

### Path Alias

The project has configured `@` alias pointing to `src` directory:

```javascript
import xxx from "@/views/xxx"; // Equivalent to import xxx from 'src/views/xxx'
```

### Naming Conventions

| Type            | Convention          | Example                |
| --------------- | ------------------- | ---------------------- |
| File Name       | kebab-case          | `emp-form-dialog.vue`  |
| Component Name  | PascalCase          | `EmpFormDialog`        |
| Route Name      | kebab-case          | `emp-mgmt`             |
| Store Variable  | camelCase           | `userStore`            |
| API Function    | camelCase + verb    | `getEmpList`, `addEmp` |
| Permission Code | kebab three-segment | `system:emp:list`      |

### API Function Naming Convention

All API functions follow unified verb-prefix naming:

| Operation        | Naming Pattern  | Example           |
| ---------------- | --------------- | ----------------- |
| Query List       | `getXxxList`    | `getEmpList`      |
| Query Detail     | `getXxxById`    | `getDeptById`     |
| Create           | `addXxx`        | `addEmp`          |
| Update           | `updateXxx`     | `updateEmp`       |
| Delete           | `deleteXxx`     | `deleteEmp`       |
| Dropdown Options | `getAllXxxList` | `getAllClazzList` |

### Environment Variables

| File               | Purpose                       |
| ------------------ | ----------------------------- |
| `.env.development` | Local development environment |
| `.env.production`  | Production environment        |
| `.env.test`        | Test environment              |
| `.env.staging`     | Staging environment           |

**Vite Environment Variables (`.env.*` files):**

| Variable               | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `VITE_APP_TITLE`       | Application title                                                    |
| `VITE_API_BASE_URL`    | API base path                                                        |
| `VITE_APP_ENV`         | Current environment identifier (development/production/test/staging) |
| `VITE_APP_VERSION`     | Application version                                                  |
| `VITE_ENABLE_MOCK`     | Whether to enable Mock data                                          |
| `VITE_ENABLE_DEVTOOLS` | Whether to enable Vue DevTools                                       |

**Build-time Variables (defined in vite.config.ts):**

| Variable            | Description                    |
| ------------------- | ------------------------------ |
| `__APP_ENV__`       | Current environment identifier |
| `__BUILD_TIME__`    | Build timestamp (ISO format)   |
| `__BUILD_VERSION__` | Application version            |
| `__BUILD_ENV__`     | Build mode                     |

---

## Build & Deployment

### Build Optimization

| Optimization         | Implementation                                 |
| -------------------- | ---------------------------------------------- |
| **Code Splitting**   | Manual chunks: vue, elementPlus, echarts, i18n |
| **gzip Compression** | `vite-plugin-compression`, threshold 10KB      |
| **Tree Shaking**     | Enabled by Vite default                        |
| **Source Map**       | Enabled in dev, disabled in production         |
| **Minification**     | `esbuild`                                      |
| **Target**           | `esnext`                                       |

### Build Output Structure

```
dist/
├── assets/
│   ├── js/
│   │   ├── vue-[hash].js
│   │   ├── elementPlus-[hash].js
│   │   ├── echarts-[hash].js
│   │   ├── i18n-[hash].js
│   │   └── [name]-[hash].js
│   ├── css/
│   │   └── [name]-[hash].css
│   └── img/
│       └── [name]-[hash].[ext]
├── index.html
└── *.gz (gzip compressed assets)
```

### Git Hooks

- **pre-commit**: Runs `lint-staged` to lint staged files
- **commit-msg**: Validates commit message format using Commitlint

---

## Recommended IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Please disable Vetur)
