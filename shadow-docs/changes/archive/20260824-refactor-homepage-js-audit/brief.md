---
{
  "schema": "shadow-dev/v1",
  "name": "20260824-refactor-homepage-js-audit",
  "type": "refactor",
  "scope": "site",
  "status": "archived",
  "baseBranch": "main",
  "branch": "refactor/20260824-refactor-homepage-js-audit",
  "files": [
    "apps/site/app/HomeView/index.tsx",
    "apps/site/app/components/AppProviders.tsx",
    "apps/site/app/layout.tsx",
    "apps/site/app/page.tsx",
    "package.json",
    "shadow-docs/knowledge/first-load-performance.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 332,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/332",
    "pullRequest": 333,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/333"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "9f97796fafa689b9bc18d9879bf4540d583db2e9",
    "verifiedAt": "2026-08-23T16:27:03.275Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:333",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---
# 首页 JS 构成审计与 FCP/FP 优化

## 动机

用户反馈首页加载 JS 文件多（生产 16 个 chunk，248.5KB gzip），质疑组件与样式是否必需。已知：框架基线（react-dom + next runtime ≈150KB gz）不可减；应用代码 ≈100KB gz 是主要可优化空间；AudioPlayer/Dialog/TypewriterMotto/ContactCard 已懒加载。需要测量基线 + 精准 chunk 归属分析，用数据找出真实可减项，避免无依据的过度优化。

## 引用规范

- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: 首屏主体数据优先；图片优先级和字体请求只依据测量结果调整；Web Vitals 上报包含 pathname
  - 适用 scope: 首页首屏加载策略与测量
- shadow-docs/knowledge/homepage-data.md
  - 当前结论: 首页运行时请求数据，不固话构建期空数据
  - 适用 scope: 首页数据边界（本次不动数据获取）

## 决策

- **选型:** 方案 A「测量 + 精准分析」先行
- **对比方案:**
  - 方案 B「客户端边界瘦身」（HomeView 下推 'use client'）：改动大、收益未测量，等 A 的分析结果再决定
  - 方案 C「请求数优化」（合并小 chunk）：请求数减少但体积不变，FCP 收益有限
- **理由:** 符合 Knowledge「只依据测量结果调整」原则；避免对 16 个 chunk 的构成做无依据猜测；测量基线可为后续 B/C 决策提供数据

## 任务

### Phase 1: 测量与审计
- [x] Lighthouse 生产站基线：FCP/FP/LCP/TBT/传输字节，3 次取中位数 — `https://wuh.site` — 测量
- [x] 本地生产构建 + 首屏 chunk 归属分析：识别每个首屏 chunk 的模块来源与大小 — `.next/` 产物 — 分析
- [x] 输出优化清单：可减项（模块 + 预估收益 + 风险）写入 brief 结果 — `shadow-docs/changes/20260824-refactor-homepage-js-audit/brief.md` — 记录

### Phase 2: 条件实施（分析确认后）
- [x] 实施明确低风险可减项并复测对比（如无明确项则跳过并说明） — 待分析确定的文件 — 修改

## 结果

- 实际耗时: 2026-08-24 约 40 分钟
- 验证: Lighthouse 生产站 3 次（FCP 3.5s / LCP 6.3s / TBT 1080ms / SI 5.9s / CLS 0.058，中位数）+ 本地生产构建 chunk 归属分析

### 审计结论

**首屏 JS = 248.5KB gzip / 16 chunk，构成合理，无多余组件：**

| 构成 | 大小(未压缩) | 说明 |
|---|---|---|
| 框架 runtime | ≈566KB | react-dom + next 16.3 turbopack 拆分（~180KB gz），硬基线不可减 |
| 组件库 | ≈200KB | Tag/Message/Empty/Image/Button/主题 token，全部为首页实际渲染组件 |

- 懒加载已验证：Dialog/TypewriterMotto/ContactCard/GlobalAudioPlayer 均不在首屏执行；Alert/Card 等 post 页组件未进首页 bundle（此前疑点为大小写误报）
- 16 个文件为 Next 16 turbopack 固定拆分形态，脚本全部同步阻塞执行（框架脚本依赖顺序）

**Phase 2 决策：无明确低风险 JS 可减项，跳过实施。** 真实优化杠杆不在 JS 组件构成：
1. TBT 1080ms 由框架解析主导，组件级减量空间为零
2. 后续可选项（超出本 brief）：请求数合并（Next 实验配置，收益低）/ 样式架构替换（styled-components → CSS，大工程）

## 知识评估

- **预期影响:** 视分析结果（若发现结构性事实如「某静态导入导致重依赖进首屏」则更新 first-load-performance.md；一次性测量数值不沉淀）
- **候选卡片:** shadow-docs/knowledge/first-load-performance.md
- **理由:** 只有长期有效的结构性事实才值得写入卡片；单次测量结果是验证输出
