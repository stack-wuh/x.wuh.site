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
