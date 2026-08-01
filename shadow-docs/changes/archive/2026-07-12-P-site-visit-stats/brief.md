# 全站访问量统计

> 原始变更名：`2026-07-12-P-site-visit-stats`

## 元数据
- 日期：2026-07-12
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
博客目前没有任何访问量数据，无法了解站点的人气和活跃度。作为个人站点，访问量是最基础也是最直观的运营指标。

## 引用规范
- `specs/visit-stats/spec.md`

## 决策
```
[Browser] → Next.js Layout → POST /api/v2/visit-stats/stats → [NestJS] → MongoDB
                                                                         ↓
[Browser] → Next.js Page  → GET  /api/v2/visit-stats/stats → [NestJS] → MongoDB
```

简单流程：
1. 前端每次页面加载，layout 中注入 `<VisitStatsReporter>` 组件
2. 该组件向后端 POST `/api/v2/visit-stats/stats` 上报一次访问
3. 后端按 IP + 30 分钟窗口去重后写入 MongoDB
4. 前端从后端 GET `/api/v2/visit-stats/stats` 获取总访问量和今日访问量
5. 展示在页面中（如 Footer 或指定位置）

| 维度 | 选择 | 理由 |
|------|------|------|
| 后端框架 | NestJS（现有） | 无需新增服务，复用现有架构 |
| 数据库 | MongoDB（现有） | 无需新增数据库，复用现有连接 |
| 去重策略 | IP + 30 分钟窗口 | 轻量，无需 Cookie/Session 支持 |

## 任务
### Phase 1: 后端 visit-stats 模块
- [ ] **文件:** `packages/shared-contracts/src/visit-stats.dto.ts`
- [ ] 定义 `VisitStatsResponse { total: number; today: number }`
- [ ] 在 `packages/shared-contracts/src/index.ts` 中导出
- [ ] **验证:** `npx tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-record.schema.ts`
- [ ] 定义 Mongoose Schema: ip, timestamp, userAgent, path
- [ ] 创建复合索引 `{ ip: 1, timestamp: -1 }`
- [ ] 导出模型定义
- [ ] **验证:** `npx tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.service.ts`
- [ ] 实现 `recordVisit()` 方法
- [ ] 实现 `getStats()` 方法
- [ ] **验证:** `npx tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.controller.ts`
- [ ] POST `/v2/visit-stats/stats` — 接收 path, 提取 IP, 调用 service
- [ ] IP 提取: 取 `x-forwarded-for` 第一个 IP，兜底 `req.ip`
- [ ] GET `/v2/visit-stats/stats` — 返回 `VisitStatsResponse` (total + today)
- [ ] **验证:** `npx tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.module.ts`
- [ ] 创建 Module 定义，导入 MongooseModule.forFeature
- [ ] **验证:** `pnpm dev:nest` 启动无异常
- [ ] **文件:** `packages/wuh.site.nest/src/app.module.ts`
- [ ] 导入 `VisitStatsModule` 并注册到 imports 列表中
- [ ] **验证:** `pnpm dev:nest` 启动无异常
### Phase 2: 前端上报与展示
- [ ] **文件:** `packages/wuh.site.next/components/visit-stats/visit-stats-reporter.tsx`
- [ ] `'use client'` 组件
- [ ] 首次加载和路由变化时 POST `/api/visit-stats/stats`
- [ ] 使用 fetch（无需缓存）
- [ ] **验证:** 页面加载后 Network tab 可见 POST 请求
- [ ] **文件:** `packages/components/layout/site-stats.tsx`
- [ ] `'use client'` 组件
- [ ] 组件挂载时调用 GET `/api/visit-stats/stats` 获取数据，每 60s 定时刷新兜底
- [ ] 显示 "总访问量: {total} | 今日: {today}"
- [ ] 使用 CSS 变量 `var(--text-muted)` 保持 Footer 样式统一
- [ ] **验证:** `npx tsc --noEmit` 零错误
- [ ] **文件:** `packages/components/layout/footer/index.tsx`
- [ ] 引入 `SiteStats` 组件
- [ ] 在 `<div>{footerConf.copyright}</div>` 下方渲染 `<SiteStats />`
- [ ] **验证:** Footer 区域显示统计数据
- [ ] **文件:** `packages/wuh.site.next/app/components/AppProviders.tsx`
- [ ] 引入 `VisitStatsReporter` 组件
- [ ] 在 `<SiteHeader />` 附近渲染（静默执行，不产生可见 UI）
- [ ] **验证:** 所有页面加载后 Network 可见 POST 请求
- [ ] 页面加载后自动上报访问记录
- [ ] 同一 IP 在 30 分钟内多次刷新只计一次
- [ ] 不同 IP 创建多条记录
- [ ] GET API 返回正确的 total 和 today
- [ ] 页面展示统计数字
- [ ] `npx tsc --noEmit` 零错误
- [ ] `pnpm dev:nest` 启动无异常
- [ ] `pnpm dev:next` 启动无异常

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-12-P-site-visit-stats
date: 2026-07-12
type: P
issue: https://github.com/stack-wuh/x.wuh.site/issues/201
library:
  new:
    - component: VisitStatsReporter
      at: packages/wuh.site.next/components/visit-stats/visit-stats-reporter.tsx
      for: 前端路由变化时向后端上报访问记录
    - component: SiteStats
      at: packages/components/layout/site-stats.tsx
      for: 在 Footer 展示总访问量和今日访问量
apply:
  instructions: |
    本需求新增全站访问量统计功能，前后端分离。
    后端新增 visit-stats 模块（Schema → Service → Controller → Module），注册到 AppModule。
    前端新增 VisitStatsReporter（嵌入 AppProviders）和 SiteStats（嵌入 Footer）。
    所有新组件在对应包下新建，具体任务和顺序见 tasks.md。
  contextFiles:
    - openspec/changes/2026-07-12-P-site-visit-stats/design.md
    - openspec/changes/2026-07-12-P-site-visit-stats/tasks.md
  tasks: tasks.md
status: archived

domain:
  name: 全站访问量统计
  keywords:
    - 访问量
    - visit
    - stats
    - 统计
    - pageview
    - 全站
    - site-wide
    - 计数器
    - counter
    - 独立访客
    - unique visitor
    - UV
    - 上报
    - report
    - analytics
  description: 给 wuh.site 添加全站访问量统计，前端上报、后端去重计数、展示总访问量和今日访问量
```

### `design.md`
# 设计文档

## 架构

```
[Browser] → Next.js Layout → POST /api/v2/visit-stats/stats → [NestJS] → MongoDB
                                                                         ↓
[Browser] → Next.js Page  → GET  /api/v2/visit-stats/stats → [NestJS] → MongoDB
```

简单流程：
1. 前端每次页面加载，layout 中注入 `<VisitStatsReporter>` 组件
2. 该组件向后端 POST `/api/v2/visit-stats/stats` 上报一次访问
3. 后端按 IP + 30 分钟窗口去重后写入 MongoDB
4. 前端从后端 GET `/api/v2/visit-stats/stats` 获取总访问量和今日访问量
5. 展示在页面中（如 Footer 或指定位置）

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 后端框架 | NestJS（现有） | 无需新增服务，复用现有架构 |
| 数据库 | MongoDB（现有） | 无需新增数据库，复用现有连接 |
| 去重策略 | IP + 30 分钟窗口 | 轻量，无需 Cookie/Session 支持 |

## 数据模型

### VisitRecord Schema

```typescript
interface VisitRecord {
  ip: string;         // 访客 IP
  timestamp: Date;    // 访问时间
  userAgent?: string; // User-Agent（可选）
  path?: string;      // 访问路径（可选，便于扩展）
}
```

索引：`{ ip: 1, timestamp: -1 }` 用于去重查询

### Query Result

```typescript
interface VisitStats {
  total: number;      // 总访问量
  today: number;      // 今日访问量
}
```

### IP 提取

```typescript
// 优先取 x-forwarded-for（生产环境 Nginx/Docker 代理透传），兜底 req.ip
const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip
```

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| useFetch | packages/hooks/useFetch | 复用 | wuh.site/demo-api-fetch |

**说明：**
- `useFetch` — 前端 SiteStats 组件可用此 hook 来调用 GET API 获取统计数据
- `VisitStatsReporter` — 新建，在 `packages/wuh.site.next/components/visit-stats/visit-stats-reporter.tsx`
- `SiteStats` — 新建，在 `packages/components/layout/footer/site-stats.tsx`
- 上报和数据展示均无现有组件可复用

## API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v2/visit-stats/stats | 上报访问 |
| GET | /api/v2/visit-stats/stats | 获取统计数据 |

**POST 请求:**

```json
{
  "path": "/blog"
}
```

**POST 响应:**

```json
{
  "success": true
}
```

**GET 响应:**

```json
{
  "total": 1234,
  "today": 56
}
```

**说明:** 前端使用 `/api/visit-stats/stats`（通过 Next.js rewrite → NestJS `/v2/visit-stats/stats`），GET 数据按导航刷新 + 60s 定时轮询兜底。

## 组件/模块设计

### 后端: VisitStatsModule

- `VisitStatsController` — 处理 POST 上报和 GET 查询
- `VisitStatsService` — 去重逻辑和统计数据
- `VisitRecord` (Schema) — MongoDB 数据模型

### 前端: VisitStatsReporter（客户端组件）

- `'use client'` 组件，嵌入 RootLayout
- 上报时机：页面加载 + 客户端导航完成后
- 使用 `usePathname()` 检测路由变化

### 前端: SiteStats 展示组件

- 展示在 Footer 的左下区域，紧接 copyright 下方
- 显示 "总访问量: {total} | 今日: {today}"
- 使用 `useFetch` 或原生 `fetch` 在组件挂载和路由变化时获取数据
- 文件位置: `packages/components/layout/footer/site-stats.tsx`

### Footer 组件修改

- `packages/components/layout/footer/index.tsx`
- 在 copyright 行 `<div>{footerConf.copyright}</div>` 之后引入 `SiteStats` 组件
- 保持 Footer 的现有布局样式不变

## 影响分析

- **新增依赖:** 无（使用现有 NestJS + Mongoose）
- **破坏性变更:** 无
- **向后兼容:** 完全兼容
- **性能影响:** 每次页面加载产生一次异步 POST 请求，不会阻塞页面渲染

### `proposal.md`
# 全站访问量统计

## 背景

博客目前没有任何访问量数据，无法了解站点的人气和活跃度。作为个人站点，访问量是最基础也是最直观的运营指标。

## 目标

- 统计 wuh.site 全站所有页面的独立访问量
- 展示总访问量（PV）
- 展示今日访问量
- 按 IP + 30 分钟窗口去重，避免短时间刷新重复计数

## 非目标（明确不做）

- 不统计文章级别的浏览量（已有 blog-display 规范约定，将来独立实现）
- 不做用户级 PV/UV 追踪
- 不做地域、设备、来源分析
- 不做实时统计，允许分钟级延迟

## 影响范围

- `packages/wuh.site.nest` — 新增 visit-stats 模块（Schema + Controller + Service）
- `packages/wuh.site.next` — 前端 layout 注入上报组件，页面展示统计数字

### `specs/visit-stats/spec.md`
# Spec: 全站访问量统计

## ADDED

### Requirement: 前端自动上报访问
- **GIVEN** 访客打开 wuh.site 任意页面
- **WHEN** 页面加载或客户端路由切换完成
- **THEN** 前端自动向后端 POST /api/v2/visit-stats/stats 上报一次访问

### Requirement: 后端按 IP 去重计数
- **GIVEN** 后端收到上报请求
- **WHEN** 30 分钟内同一 IP 已存在访问记录
- **THEN** 跳过此次计数，不插入新记录
- **AND** 30 分钟后同一 IP 再次上报时，视为新访问

### Requirement: 查询访问量统计
- **GIVEN** 前端 GET /api/v2/visit-stats/stats
- **WHEN** 请求成功
- **THEN** 返回总访问量和今日访问量
- **AND** 总访问量 = 所有去重后的记录总数
- **AND** 今日访问量 = 当日 00:00:00 以来的去重记录数

### Requirement: 页面展示统计数据
- **GIVEN** 任意页面的 Footer 区域
- **WHEN** 页面渲染
- **THEN** 显示 "总访问量: {total} | 今日: {today}"
- **AND** 统计数据定期自动刷新

### `tasks.md`
# 任务清单

## Phase 1: 后端 visit-stats 模块

### Task 0: 创建共享 DTO 类型

- [ ] **文件:** `packages/shared-contracts/src/visit-stats.dto.ts`
- [ ] 定义 `VisitStatsResponse { total: number; today: number }`
- [ ] 在 `packages/shared-contracts/src/index.ts` 中导出
- [ ] **验证:** `npx tsc --noEmit` 零错误

### Task 1: 创建 VisitRecord Schema

- [ ] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-record.schema.ts`
- [ ] 定义 Mongoose Schema: ip, timestamp, userAgent, path
- [ ] 创建复合索引 `{ ip: 1, timestamp: -1 }`
- [ ] 导出模型定义
- [ ] **验证:** `npx tsc --noEmit` 零错误


### Task 2: 创建 VisitStatsService

- [ ] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.service.ts`
- [ ] 实现 `recordVisit()` 方法
  - 查询最近 30 分钟内同一 IP 的记录
  - 如有则跳过（去重），无则插入新记录
- [ ] 实现 `getStats()` 方法
  - 查询总记录数作为 total
  - 查询当天 0 点后的记录数作为 today
- [ ] **验证:** `npx tsc --noEmit` 零错误

### Task 3: 创建 VisitStatsController

- [ ] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.controller.ts`
- [ ] POST `/v2/visit-stats/stats` — 接收 path, 提取 IP, 调用 service
- [ ] IP 提取: 取 `x-forwarded-for` 第一个 IP，兜底 `req.ip`
- [ ] GET `/v2/visit-stats/stats` — 返回 `VisitStatsResponse` (total + today)
- [ ] **验证:** `npx tsc --noEmit` 零错误

### Task 4: 注册 VisitStatsModule

- [ ] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.module.ts`
- [ ] 创建 Module 定义，导入 MongooseModule.forFeature
- [ ] **验证:** `pnpm dev:nest` 启动无异常

### Task 5: 注册到 AppModule

- [ ] **文件:** `packages/wuh.site.nest/src/app.module.ts`
- [ ] 导入 `VisitStatsModule` 并注册到 imports 列表中
- [ ] **验证:** `pnpm dev:nest` 启动无异常

## Phase 2: 前端上报与展示

### Task 6: 创建 VisitStatsReporter（客户端上报组件）

- [ ] **文件:** `packages/wuh.site.next/components/visit-stats/visit-stats-reporter.tsx`
- [ ] `'use client'` 组件
- [ ] 首次加载和路由变化时 POST `/api/visit-stats/stats`
- [ ] 使用 fetch（无需缓存）
- [ ] **验证:** 页面加载后 Network tab 可见 POST 请求

### Task 7: 创建 SiteStats 展示组件

- [ ] **文件:** `packages/components/layout/site-stats.tsx`
- [ ] `'use client'` 组件
- [ ] 组件挂载时调用 GET `/api/visit-stats/stats` 获取数据，每 60s 定时刷新兜底
- [ ] 显示 "总访问量: {total} | 今日: {today}"
- [ ] 使用 CSS 变量 `var(--text-muted)` 保持 Footer 样式统一
- [ ] **验证:** `npx tsc --noEmit` 零错误

### Task 8: 修改 Footer 组件

- [ ] **文件:** `packages/components/layout/footer/index.tsx`
- [ ] 引入 `SiteStats` 组件
- [ ] 在 `<div>{footerConf.copyright}</div>` 下方渲染 `<SiteStats />`
- [ ] **验证:** Footer 区域显示统计数据

### Task 9: 嵌入 VisitStatsReporter 到 AppProviders

- [ ] **文件:** `packages/wuh.site.next/app/components/AppProviders.tsx`
- [ ] 引入 `VisitStatsReporter` 组件
- [ ] 在 `<SiteHeader />` 附近渲染（静默执行，不产生可见 UI）
- [ ] **验证:** 所有页面加载后 Network 可见 POST 请求

## 验收

- [ ] 页面加载后自动上报访问记录
- [ ] 同一 IP 在 30 分钟内多次刷新只计一次
- [ ] 不同 IP 创建多条记录
- [ ] GET API 返回正确的 total 和 today
- [ ] 页面展示统计数字
- [ ] `npx tsc --noEmit` 零错误
- [ ] `pnpm dev:nest` 启动无异常
- [ ] `pnpm dev:next` 启动无异常
