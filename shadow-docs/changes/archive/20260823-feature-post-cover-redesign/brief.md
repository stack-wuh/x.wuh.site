---
{
  "schema": "shadow-dev/v1",
  "name": "20260823-feature-post-cover-redesign",
  "type": "feature",
  "scope": "site",
  "status": "archived",
  "baseBranch": "main",
  "branch": "feature/20260823-feature-post-cover-redesign",
  "files": [
    "apps/site/app/post/PostView/index.tsx",
    "apps/site/app/post/components/PostCover/README.md",
    "apps/site/app/post/components/PostCover/index.tsx",
    "apps/site/app/post/components/PostCover/specs.tsx",
    "apps/site/app/post/styles/index.ts",
    "apps/site/app/post/styles/post-header.ts",
    "shadow-docs/knowledge/blog-detail.md",
    "shadow-docs/knowledge/post-cover.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 330,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/330",
    "pullRequest": 331,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/331"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "e6816e8decbe73794343c233edac5f9dc50097cb",
    "verifiedAt": "2026-08-23T15:45:58.823Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:331",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---
# 博客详情页封面重新设计

## 动机

当前封面是「原图直接铺」：16:9 圆角图，无任何视觉包装；无封面时直接不渲染，文章失去视觉入口。目标是把封面做成有设计感的「文艺杂志卡」——有图时包装升级，无图时有生成式兜底，与站点浪漫文艺的风格统一。

## 引用规范

- shadow-docs/knowledge/post-cover.md
  - 当前结论: 封面通过 `<!-- cover: -->` 元数据声明；显式封面不得删除正文首图；无封面或加载失败不得保留破图区域
  - 适用 scope: PostCover 组件与封面样式
- shadow-docs/knowledge/blog-detail.md
  - 当前结论: 封面图在标题/元数据下方、正文上方展示；无封面时不渲染封面区域
  - 适用 scope: 详情页整体排版结构（封面保持原位，标题不压图）

## 决策

- **选型:** 方案一「文艺杂志卡」
- **对比方案:**
  - 方案二「新中式书页」（窄幅书页比例+竖排标题）：留白最多，但阅读栏内显小气，标题可读性风险高
  - 方案三「沉浸式头图」（标题压图+渐变蒙版）：视觉冲击最强，但标题需移入封面区，与 blog-detail 排版约束冲突，改动大
- **理由:** 保留现有「标题/元数据在上 → 封面 → 正文」结构，封面作为视觉包装升级；生成式封面用纯 CSS 实现（主题 token 联动酒红/素雅两套主题），不引入 satori 等图片生成依赖

## 任务

### Phase 1: PostCover v2 组件
- [x] 有图分支：圆角卡片 + 1px 主题色细边框 + 底部温柔渐变叠层（主题色 alpha 渐变）+ 底部信息条（日期 · 标签）— `apps/site/app/post/components/PostCover/index.tsx` — 重构组件与样式
- [x] 无图生成式分支：主题渐变背景 + 装饰 SVG（山峦/涟漪线 + 菱形，呼应首页 DiamondDivider）+ 衬线标题排版（限行数防溢出）+ 落款「wuh.site · 日期」— `apps/site/app/post/components/PostCover/index.tsx` — 新增分支
- [x] 信息传入：PostView 将 title/date/labels 传给 PostCover — `apps/site/app/post/PostView/index.tsx` — 修改调用处
- [x] 移动端与动效回归：全宽出血、reduced-motion 关闭、加载失败隐藏不破图 — `apps/site/app/post/styles/post-header.ts` — 更新样式
- [x] specs 更新与验收 — `apps/site/app/post/components/PostCover/specs.tsx` + `README.md` — 更新类型与文档，dev server 肉眼验收两套主题

### Phase 2: 知识更新
- [x] 更新 post-cover.md 当前结论为新封面设计 — `shadow-docs/knowledge/post-cover.md` — 修改卡片

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/post-cover.md
- **理由:** 封面渲染方式从「原图直铺」变为「包装 + 生成式兜底」，当前结论需同步；blog-detail.md 仅引用关系不变
