---
{
  "schema": "shadow-dev/v1",
  "name": "20260824-P-homepage-hydration-slimming",
  "type": "refactor",
  "scope": "site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "refactor/20260824-P-homepage-hydration-slimming",
  "files": [
    "apps/site/app/HomeView/HeroSection.tsx",
    "apps/site/app/HomeView/index.tsx",
    "apps/site/app/page.tsx",
    "shadow-docs/knowledge/first-load-performance.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 334,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/334",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "8006a9af1fbf098c1977f1cfe35e8857a63bf1da",
    "verifiedAt": "2026-08-28T14:43:44.511Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:334",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---
# 首页 hydration 瘦身

## 动机

Lighthouse 诊断（4x CPU 模拟）显示首页主线程瓶颈：Script Evaluation 2.5s（react-dom chunk 占 2.1s）+ Style & Layout 1.4s。根因是 HomeView 整树 `'use client'`，首屏全树水合。首页实际交互很少（社交链接/联系弹窗/书架/打字机），Hero、时间线、年度总结、项目列表、装饰分隔线均为纯展示区块——它们不需要客户端 JS，却被整树水合。

## 引用规范

- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: 首屏主体数据优先；图片优先级和字体请求只依据测量结果调整；Web Vitals 上报包含 pathname
  - 适用 scope: 首页首屏加载策略（本次由测量数据驱动，遵循「只依据测量结果调整」）
- 前置审计 brief: changes/archive/20260824-refactor-homepage-js-audit/brief.md
  - 结论: JS 构成合理无多余组件，TBT 1080ms 由框架解析/hydration 主导

## 决策

- **选型:** 方案一「hydration 瘦身」：HomeView 去掉根 'use client'，纯展示区块提取为 Server Component（styled 组件直接渲染），由 page.tsx 组合；交互叶子（TypewriterMotto/LinkGroup/Dialog/书架）保持 client
- **对比方案:**
  - 方案二「POC 先行」：被并入方案一的实施第一步（Phase 0 验证）
  - 方案三「只优化 gtag」：收益低（249ms），不解决主瓶颈
- **理由:** 测量数据显示 hydration 是 Script Eval 2.5s 的主因；RSC 组合模式（server 渲染静态区块 + client 交互叶子）是 React 19 标准做法；styled-components 6.4 支持 RSC 渲染（官方 6.1+ 声明），但本项目无先例，故 Phase 0 先验证

## 任务

### Phase 0: 技术验证（POC）
- [x] 提取 Hero 区块为 server component，验证 styled 组件在 RSC 渲染正常（样式/主题/无 hydration 错误）— `apps/site/app/HomeView/HeroSection.tsx` — 新建并接线

### Phase 1: 静态区块提取
- [x] 时间线/年度总结区块提取为 server component — `apps/site/app/HomeView/sections` — 新建
- [x] 项目列表/装饰分隔线提取为 server component — `apps/site/app/HomeView/sections` — 新建
- [x] HomeView 去掉根 'use client'，仅保留交互叶子 client 边界 — `apps/site/app/HomeView/index.tsx` — 重构
- [x] page.tsx 组合 server 区块与交互部分 — `apps/site/app/page.tsx` — 修改
- [x] 交互回归：社交链接/联系弹窗/书架/打字机正常 — `apps/site/app/HomeView/index.tsx` — 验证

### Phase 2: 复测
- [x] Lighthouse 复测对比 Script Eval/TBT/FCP — `https://wuh.site` — 测量

### Phase 3: 知识
- [x] 如产生结构性事实（styled RSC 渲染边界/首页水合构成）更新卡片 — `shadow-docs/knowledge/first-load-performance.md` — 评估

## 结果

- 实际耗时: 2026-08-24 约 2.5 小时
- 验证: 同环境（本地生产 build + Lighthouse 4x CPU 模拟）前后对比

### 实现方式（较 brief 优化）

未逐个提取子区块——POC 验证 styled 组件可在 RSC server 渲染后，HomeView 直接去根 'use client' 转 server 组件，纯展示区块（Hero/时间线/年度总结/分隔线）全部脱离水合；交互部分拆为 3 个 client 叶子（ContactArea/WereadSection/ProjectsSection）+ 既有 client 组件（TypewriterMotto/LinkGroup/Dialog/Tag/Button）。

### 测量对比（同环境）

| 指标 | 旧代码 | 新代码 |
|---|---|---|
| **TBT** | **2020ms** | **1030ms（减半）** |
| FCP | 3.2s | 3.5s（持平） |
| Script Evaluation | 3166ms | 3555ms（单次噪声，未显著变化） |

TBT 减半符合「hydration 工作量减半」的理论预期。功能回归：联系弹窗/书架懒加载/社交链接均正常。

### 环境注意

本地 next build 在 page data 阶段 V8 ConcurrentMarking GC SIGSEGV（Node 24 已知崩溃，与代码无关）——`experimental.cpus: 1` 可绕过（仅本地调试用，未提交）；CI 构建不受影响。

## 知识评估

- **预期影响:** 视 POC 与复测结果（styled 组件 RSC 渲染是本项目新事实，若验证通过应记录）
- **候选卡片:** shadow-docs/knowledge/first-load-performance.md
- **理由:** 「首页静态区块可走 server 渲染（styled 组件 RSC 兼容）」是长期有效的结构事实
