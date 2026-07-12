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

**说明:** GET 数据按导航刷新（路由变化时自动重新获取），不设定时轮询。

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
