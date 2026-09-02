---
{
  "schema": "shadow-dev/v1",
  "name": "20260901-post-related-share-redesign",
  "type": "style",
  "scope": "post",
  "status": "published",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "apps/site/app/post/PostView/index.tsx",
    "apps/site/app/post/components/RelatedPosts/index.tsx",
    "apps/site/app/post/styles/index.ts",
    "apps/site/app/post/styles/post-article.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 347,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/347",
    "pullRequest": 349,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/349"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "e76dd8c85861ad568d2678f90b6166225d191853",
    "verifiedAt": "2026-09-02T08:05:24.748Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:349",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 详情页继续阅读与分享区重设计：书目条目式 + 文字药丸

## 动机

详情页第一轮纸面化（PR #348）合入后，对「继续阅读」（RelatedPosts）与文末分享区做定向重设计：继续阅读由"线索小径 + 圆点节点"改为**书目条目式**（像参考文献/书目卡片），分享按钮由圆形图标钮改为**文字药丸**（与点赞按钮同族的描边形态）。

## 引用规范

- knowledge/blog-detail.md
  - 当前结论: 相关文章基于标签与时间排序、去重且最多 3 篇；「继续阅读」以线索小径 + 轻卡片呈现（本变更将改写为书目条目式，预期影响：更新）
  - 适用 scope: apps/site/app/post
  - 约束: 推荐算法（selectRelatedPosts）不动，只改呈现层；计数「拾遗 N 则」与文气引导语保留
- knowledge/design-system.md
  - 当前结论: 颜色经主题变量暴露、字体只用三个语义 token、断点用 BREAKPOINTS 三档
  - 适用 scope: apps/site, packages/components/themes
  - 约束: 新样式只用 token，不引入裸色值/裸断点/prefers-color-scheme

## 决策

- **书目条目式细则:** 每条为 `RelatedPostRow` 单行条目——汉字序号 marker（一/二/三，accent 金衬线）+ 条目主体（标题衬线 500 两行封顶、摘要两行、「线索 / 标签」小注）+ 点线 leader（dotted，基准对齐）+ `→` 箭头；整个条目单链接，触达块 `--space-xs` 纵向 padding
- **文字药丸细则（已被取代）:** 分享按钮原设计为 ColophonShareRow + SharePill 文字描边药丸。**冲突裁定（20260902 解冲突时）:** 该设计与 #350 已合入的验收裁定「分享组完全复用 SharedLinkGroup 默认形态」互斥，按用户最新裁定**放弃文字药丸**，分享区维持 SharedLinkGroup 原生形态；本变更最终保留的独有价值为书目条目式继续阅读
- **与 main 融合裁定:** 20260902 解决 PR #349 与 main（#350）的冲突——分享区/三钮组/目录侧栏结构以 main 为准，RelatedPosts 书目条目式予以保留；ColophonShareRow/SharePill/RelatedPostContent 定义与导出删除

## 任务

- [x] 继续阅读改书目条目式：RelatedPostRow/Marker/Body/Leader 新样式组件 + RelatedPosts 组件改写（汉字序号 ENTRY_MARKERS、摘要两行、「线索 / 标签」小注、点线 leader + 箭头） — apps/site/app/post/styles/post-article.ts + components/RelatedPosts/index.tsx — 改动
- [x] PostView 接入（shareItems 渲染区结构调整） — apps/site/app/post/PostView/index.tsx — 改动
- [x] 与 main（#350）解冲突：分享区取 SharedLinkGroup 复用裁定（删 ColophonShareRow/SharePill 定义与导出）、TOC/三钮组取 main 侧栏化结构、保留书目条目式；tsc 通过 — apps/site/app/post/PostView/index.tsx + styles/index.ts + styles/post-article.ts — 改动
- [x] 补建本 change brief 并录入审查（变更本体先行开发，brief 于 release 前补录） — shadow-docs/changes/20260901-post-related-share-redesign/brief.md — 补录

## 结果

- 实际耗时: —
- 验证: tsc --noEmit 通过；冲突后 mergeable: true；书目条目式待合并后线上验收

## 知识评估

- **预期影响:** 更新
- **候选卡片:** knowledge/blog-detail.md（「相关文章」段：呈现由线索小径 + 圆点节点改写为书目条目式——汉字序号 + 点线 leader + 箭头；推荐算法与「拾遗 N 则」计数不变）
- **理由:** 该卡当前结论描述的继续阅读呈现形态已被本变更替换；分享区维持 SharedLinkGroup 复用结论，无新增事实
