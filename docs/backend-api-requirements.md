# Tlias 系统后端接口需求文档

> **文档目的**：前端企业级升级所需的后端接口配合清单
> **优先级**：P0（必须） / P1（重要） / P2（可选）
> **最后更新**：2026-06-28

---

## 一、现有接口规范说明

### 1.1 统一响应格式

当前所有接口均使用以下响应格式，新增接口请保持一致：

```json
{
  "code": 1,
  "msg": "操作成功",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | Integer | 1=成功，0=失败 |
| msg | String | 提示信息 |
| data | Object/Array | 业务数据 |

### 1.2 认证方式

- Token 通过请求头传递：`token: xxx`
- 登录接口除外，其他接口均需校验 Token

### 1.3 现有接口清单

| 模块 | 接口 | 方法 |
|------|------|------|
| 登录 | `/login` | POST |
| 修改密码 | `/password` | PUT |
| 部门管理 | `/depts` | GET/POST/PUT/DELETE |
| 员工管理 | `/emps` | GET/POST/PUT/DELETE |
| 班级管理 | `/clazzs` | GET/POST/PUT/DELETE |
| 学生管理 | `/students` | GET/POST/PUT/DELETE |
| 报表统计 | `/report/*` | GET |
| 操作日志 | `/log/page` | GET |

---

## 二、需求一：权限体系接口（P0 - 必须）

### 2.1 需求背景

当前系统只有登录态判断，无角色和权限控制。前端需要实现 RBAC（基于角色的访问控制），包括：
- 菜单级权限：不同角色看到不同菜单
- 按钮级权限：控制新增/删除/导出等按钮的显示
- 接口级权限：后端校验用户是否有权调用该接口

### 2.2 登录接口增强

**现状**：登录接口只返回 token

```json
// 当前响应
{
  "code": 1,
  "msg": "登录成功",
  "data": { "token": "xxx" }
}
```

**需求**：登录成功后同时返回用户基本信息和权限数据

```
POST /login
```

**请求参数**（不变）：
```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应**（增强）：
```json
{
  "code": 1,
  "msg": "登录成功",
  "data": {
    "token": "xxx",
    "userInfo": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "avatar": "https://xxx/avatar.jpg"
    },
    "roles": ["admin"],
    "permissions": [
      "system:dept:list",
      "system:dept:add",
      "system:dept:edit",
      "system:dept:delete",
      "system:emp:list",
      "system:emp:add",
      "system:emp:edit",
      "system:emp:delete",
      "stu:clazz:list",
      "stu:clazz:add",
      "stu:clazz:edit",
      "stu:clazz:delete",
      "stu:stu:list",
      "stu:stu:add",
      "stu:stu:edit",
      "stu:stu:delete",
      "report:emp:view",
      "report:stu:view",
      "report:log:view"
    ]
  }
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | String | 是 | 访问令牌 |
| userInfo.id | Integer | 是 | 用户ID |
| userInfo.username | String | 是 | 登录账号 |
| userInfo.name | String | 是 | 显示名称 |
| userInfo.avatar | String | 否 | 头像URL，为空时前端使用默认头像 |
| roles | String[] | 是 | 角色标识数组，如 `["admin"]`、`["teacher"]` |
| permissions | String[] | 是 | 权限标识数组，格式 `模块:资源:操作` |

### 2.3 获取当前用户信息接口（备选方案）

如果登录接口不方便改造，可单独提供此接口，前端在登录后调用：

```
GET /user/info
```

**响应**：
```json
{
  "code": 1,
  "msg": "操作成功",
  "data": {
    "userInfo": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "avatar": "https://xxx/avatar.jpg"
    },
    "roles": ["admin"],
    "permissions": ["system:dept:list", "system:dept:add", "..."]
  }
}
```

> 前端会在以下场景调用此接口：
> 1. 页面刷新后重新获取权限（Token 还在但内存中权限数据丢失）
> 2. 路由守卫中校验权限

### 2.4 权限标识命名规范

建议采用 `模块:资源:操作` 三段式命名：

| 模块 | 资源 | 操作 | 权限标识 | 说明 |
|------|------|------|----------|------|
| system | dept | list | system:dept:list | 部门列表 |
| system | dept | add | system:dept:add | 新增部门 |
| system | dept | edit | system:dept:edit | 修改部门 |
| system | dept | delete | system:dept:delete | 删除部门 |
| system | emp | list | system:emp:list | 员工列表 |
| system | emp | add | system:emp:add | 新增员工 |
| system | emp | edit | system:emp:edit | 修改员工 |
| system | emp | delete | system:emp:delete | 删除员工 |
| stu | clazz | list | stu:clazz:list | 班级列表 |
| stu | clazz | add | stu:clazz:add | 新增班级 |
| stu | clazz | edit | stu:clazz:edit | 修改班级 |
| stu | clazz | delete | stu:clazz:delete | 删除班级 |
| stu | stu | list | stu:stu:list | 学生列表 |
| stu | stu | add | stu:stu:add | 新增学生 |
| stu | stu | edit | stu:stu:edit | 修改学生 |
| stu | stu | delete | stu:stu:delete | 删除学生 |
| report | emp | view | report:emp:view | 员工报表 |
| report | stu | view | report:stu:view | 学生报表 |
| report | log | view | report:log:view | 日志报表 |

> 管理员（admin 角色）建议返回 `["*"]` 表示拥有所有权限，前端特殊处理。

### 2.5 接口权限校验

后端需要为现有接口增加权限校验，以下是建议的接口-权限映射：

| 接口 | 方法 | 所需权限 |
|------|------|----------|
| `/depts` | GET | system:dept:list |
| `/depts` | POST | system:dept:add |
| `/depts` | PUT | system:dept:edit |
| `/depts` | DELETE | system:dept:delete |
| `/emps` | GET | system:emp:list |
| `/emps` | POST | system:emp:add |
| `/emps` | PUT | system:emp:edit |
| `/emps` | DELETE | system:emp:delete |
| `/clazzs` | GET | stu:clazz:list |
| `/clazzs` | POST | stu:clazz:add |
| `/clazzs` | PUT | stu:clazz:edit |
| `/clazzs` | DELETE | stu:clazz:delete |
| `/students` | GET | stu:stu:list |
| `/students` | POST | stu:stu:add |
| `/students` | PUT | stu:stu:edit |
| `/students` | DELETE | stu:stu:delete |
| `/report/*` | GET | report:emp:view / report:stu:view |
| `/log/page` | GET | report:log:view |

### 2.6 权限不足响应

用户无权限访问接口时，后端返回：

```json
{
  "code": 0,
  "msg": "权限不足，无法访问",
  "data": null
}
```

或 HTTP 状态码 403：

```
HTTP 403 Forbidden
```

前端会在响应拦截器中统一处理，跳转到 403 页面或提示用户。

---

## 三、需求二：Token 刷新机制（P1 - 重要）

### 3.1 需求背景

当前 Token 过期后，前端直接收到 401 并跳转登录页，用户体验较差。需要实现**无感刷新**：Token 过期时自动用 RefreshToken 换取新 Token，用户无感知。

### 3.2 方案一：双 Token 机制（推荐）

**登录时返回双 Token**：

```json
// POST /login 响应增强
{
  "code": 1,
  "msg": "登录成功",
  "data": {
    "token": "xxx",
    "refreshToken": "yyy",
    "expiresIn": 7200,
    "userInfo": { ... },
    "roles": [...],
    "permissions": [...]
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| token | String | 访问令牌，有效期短（如 2 小时） |
| refreshToken | String | 刷新令牌，有效期长（如 7 天） |
| expiresIn | Integer | token 有效期，单位秒，前端用于定时刷新 |

**刷新 Token 接口**：

```
POST /auth/refresh
```

**请求参数**：
```json
{
  "refreshToken": "yyy"
}
```

**响应**：
```json
{
  "code": 1,
  "msg": "刷新成功",
  "data": {
    "token": "新token",
    "expiresIn": 7200
  }
}
```

> 注：refreshToken 可以一次性使用（用一次失效，返回新的 refreshToken），也可以重复使用直到过期。建议一次性使用更安全。

### 3.3 方案二：Token 续期机制（简化版）

如果不想引入 refreshToken，可采用续期方案：

```
PUT /auth/renew
```

**响应**：
```json
{
  "code": 1,
  "msg": "续期成功",
  "data": {
    "token": "新token",
    "expiresIn": 7200
  }
}
```

前端在 Token 快过期前（如剩余 5 分钟）自动调用此接口续期。

### 3.4 Token 过期的错误码约定

需要和后端约定 Token 过期的标识，便于前端精准识别：

| 场景 | HTTP 状态码 | 响应体 | 前端处理 |
|------|-------------|--------|----------|
| Token 无效/过期 | 401 | `{ code: 0, msg: "token已过期" }` | 尝试刷新，失败则跳登录 |
| RefreshToken 无效 | 401 | `{ code: 0, msg: "refreshToken已失效" }` | 直接跳登录页 |
| 权限不足 | 403 | `{ code: 0, msg: "权限不足" }` | 提示用户 |

---

## 四、需求三：文件上传接口（P1 - 重要）

### 4.1 需求背景

员工管理中有头像上传需求，学生管理中可能需要上传照片/附件。当前系统缺少统一的文件上传接口。

### 4.2 接口定义

```
POST /files/upload
```

**请求参数**（multipart/form-data）：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 上传的文件 |
| type | String | 否 | 文件类型分类，如 `avatar`、`student_photo`、`attachment` |

**响应**：

```json
{
  "code": 1,
  "msg": "上传成功",
  "data": {
    "url": "https://xxx/files/2026/06/28/uuid.jpg",
    "name": "avatar.jpg",
    "size": 102400
  }
}
```

### 4.3 文件删除接口

```
DELETE /files
```

**请求参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| url | String | 文件访问地址 |

**响应**：
```json
{
  "code": 1,
  "msg": "删除成功",
  "data": null
}
```

### 4.4 要求

- 支持的文件类型：jpg、png、gif、pdf、doc、docx、xls、xlsx
- 单文件大小限制：图片 ≤ 5MB，文档 ≤ 20MB
- 返回的 URL 需可直接访问（配置好静态资源映射）
- 建议按日期分目录存储：`/files/2026/06/28/uuid.jpg`

---

## 五、需求四：数据字典接口（P2 - 可选）

### 5.1 需求背景

系统中存在大量枚举值（员工职位、学生学历、班级状态等），目前硬编码在前端。建议后端统一下发，前端缓存。

### 5.2 接口定义

```
GET /dicts
```

**请求参数**（可选，不传则返回全部）：

| 参数 | 类型 | 说明 |
|------|------|------|
| type | String | 字典类型，如 `emp_job`、`stu_degree` |

**响应**：

```json
{
  "code": 1,
  "msg": "操作成功",
  "data": [
    {
      "type": "emp_job",
      "label": "班主任",
      "value": 1
    },
    {
      "type": "emp_job",
      "label": "讲师",
      "value": 2
    },
    {
      "type": "stu_degree",
      "label": "大专",
      "value": 1
    },
    {
      "type": "stu_degree",
      "label": "本科",
      "value": 2
    }
  ]
}
```

前端会在首次加载时调用并缓存，后续直接从缓存读取。

---

## 六、需求五：操作日志增强（P2 - 可选）

### 6.1 需求背景

当前日志查询接口 `/log/page` 已存在，但前端需要确认日志字段是否完整，以支撑审计功能。

### 6.2 期望的日志字段

```json
{
  "code": 1,
  "msg": "操作成功",
  "data": {
    "total": 100,
    "rows": [
      {
        "id": 1,
        "operateUser": "admin",
        "operateTime": "2026-06-28 10:30:00",
        "operateIp": "192.168.1.100",
        "method": "POST",
        "url": "/emps",
        "params": "{\"name\":\"张三\"}",
        "result": "成功",
        "errorMsg": null,
        "costTime": 120
      }
    ]
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 日志ID |
| operateUser | String | 操作人 |
| operateTime | String | 操作时间 |
| operateIp | String | 操作IP |
| method | String | 请求方法 |
| url | String | 请求地址 |
| params | String | 请求参数（JSON字符串） |
| result | String | 操作结果（成功/失败） |
| errorMsg | String | 错误信息（失败时） |
| costTime | Integer | 耗时（毫秒） |

---

## 七、需求六：前端日志上报接口（P2 - 可选）

### 7.1 需求背景

前端需要上报 JS 错误、性能数据、用户行为等，便于线上问题排查和体验优化。

> 如果接入 Sentry 等第三方监控平台，则此接口非必须。

### 7.2 接口定义

```
POST /log/report
```

**请求参数**（JSON）：

```json
{
  "type": "error",
  "data": {
    "message": "TypeError: Cannot read property 'name' of undefined",
    "stack": "at xxx.vue:25:10\nat ...",
    "url": "/emp",
    "userAgent": "Mozilla/5.0 ...",
    "userId": 1
  },
  "timestamp": 1719652200000
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| type | String | 日志类型：`error`/`performance`/`behavior` |
| data | Object | 日志内容 |
| timestamp | Long | 时间戳 |

**响应**：
```json
{
  "code": 1,
  "msg": "上报成功",
  "data": null
}
```

---

## 八、优先级与排期建议

| 优先级 | 需求 | 说明 | 前端阻塞程度 |
|--------|------|------|-------------|
| **P0** | 权限体系接口 | 登录增强 / 用户信息 / 接口鉴权 | 阻塞 RBAC 权限功能 |
| **P1** | Token 刷新机制 | 双 Token 或续期方案 | 影响用户体验，有降级方案 |
| **P1** | 文件上传接口 | 头像、附件上传 | 影响员工/学生模块体验 |
| **P2** | 数据字典接口 | 枚举值统一管理 | 前端可临时硬编码 |
| **P2** | 操作日志增强 | 完善审计字段 | 现有接口可继续使用 |
| **P2** | 前端日志上报 | 监控体系 | 可用 Sentry 替代 |

### 建议后端排期

```
第一周：权限体系（P0）
├── 数据库：用户-角色-权限表设计
├── 登录接口增强（返回权限数据）
├── 接口权限校验拦截器
└── 提供用户信息接口

第二周：Token 刷新 + 文件上传（P1）
├── 双 Token 机制或续期方案
└── 文件上传/删除接口

第三周（可选）：数据字典 + 日志增强（P2）
├── 数据字典接口
├── 操作日志字段完善
└── 前端日志上报接口
```

---

## 九、数据库设计参考

如果后端目前没有权限相关的表结构，以下是参考设计：

### 9.1 用户表（已有，需确认字段）

```sql
CREATE TABLE user (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  username    VARCHAR(50) UNIQUE NOT NULL,
  password    VARCHAR(100) NOT NULL,
  name        VARCHAR(50),
  avatar      VARCHAR(255),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 9.2 角色表

```sql
CREATE TABLE role (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(50) NOT NULL COMMENT '角色名称，如：管理员',
  code        VARCHAR(50) UNIQUE NOT NULL COMMENT '角色标识，如：admin',
  description VARCHAR(200),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 9.3 权限表

```sql
CREATE TABLE permission (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(50) NOT NULL COMMENT '权限名称，如：新增员工',
  code        VARCHAR(100) UNIQUE NOT NULL COMMENT '权限标识，如：system:emp:add',
  type        VARCHAR(20) COMMENT 'menu/button/api',
  parent_id   INT DEFAULT 0 COMMENT '父权限ID',
  sort        INT DEFAULT 0 COMMENT '排序',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 9.4 用户-角色关联表

```sql
CREATE TABLE user_role (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id)
);
```

### 9.5 角色-权限关联表

```sql
CREATE TABLE role_permission (
  role_id       INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id)
);
```

### 9.6 查询用户权限的 SQL

```sql
-- 根据用户ID查询所有权限标识
SELECT DISTINCT p.code
FROM user u
  JOIN user_role ur ON u.id = ur.user_id
  JOIN role_permission rp ON ur.role_id = rp.role_id
  JOIN permission p ON rp.permission_id = p.id
WHERE u.id = #{userId};
```

---

## 十、联调说明

### 10.1 前端代理配置

前端开发环境通过 Vite 代理转发请求，后端无需处理跨域：

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

前端所有请求以 `/api` 开头，代理后去掉 `/api` 前缀转发到后端。

### 10.2 联调步骤

1. 后端完成权限表设计和数据初始化
2. 后端改造登录接口，返回权限数据
3. 前端联调登录 + 权限获取
4. 后端添加接口权限拦截器
5. 前端联调菜单/按钮权限控制
6. 后端完成 Token 刷新接口
7. 前端联调无感刷新
8. 联调测试通过，上线

### 10.3 测试账号建议

| 账号 | 角色 | 权限 | 用途 |
|------|------|------|------|
| admin | 管理员 | 全部权限 | 测试完整功能 |
| teacher | 教师 | 学生管理 + 报表查看 | 测试部分权限 |
| viewer | 访客 | 只读权限 | 测试权限限制 |

---

*文档版本：v1.0*
*最后更新：2026-06-28*
*前端负责人：待填写*
*后端负责人：待填写*
