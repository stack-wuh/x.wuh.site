---
{
  "schema": "shadow-dev/v1",
  "name": "20260902-style-post-detail-polish",
  "type": "style",
  "scope": "apps/site,packages/components",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20260902-style-post-detail-polish",
  "files": [
    "apps/site/app/post/PostView/index.tsx",
    "apps/site/app/post/components/PostComments/index.tsx",
    "apps/site/app/post/components/PostComments/styles/index.tsx",
    "apps/site/app/post/styles/index.ts",
    "apps/site/app/post/styles/post-article.ts",
    "apps/site/app/post/styles/post-layout.ts",
    "apps/site/app/post/styles/post-markdown.ts",
    "packages/components/divider/index.test.mjs",
    "packages/components/divider/index.tsx",
    "packages/components/divider/readme.md",
    "packages/components/divider/specs.tsx",
    "packages/components/divider/styles/index.tsx",
    "packages/components/package.json"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "c1538109809d533e0f6233ef55e5165b6a64c9c8",
    "verifiedAt": "2026-09-02T11:00:23.055Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 20260902-style-post-detail-polish

## 动机

生产页分享区与最新原型（archive/20260901-style-post-paper-redesign/prototype-v2.html）产出不一致：SharedLinkGroup 带「分享到」标签、hover 有 pulse/iconBounce 循环动画（原型明确无循环关键帧），暗色适配走 prefers-color-scheme 绕过站点 data-color-scheme 主题模型，系统深色 + 站点浅色时按钮呈深色圆底不跟随主题；页面结构线散落在各容器 border；正文 16px/1.92 观感粗犷。

## 引用规范

- shadow-docs/knowledge/design-system.md — 颜色必须经主题变量暴露；主题为 data-theme-family × data-color-scheme 双维度；过渡走 motion tokens；断点用语义常量
- shadow-docs/knowledge/components.md — 组件经 exports map 以 @wuh.site/components/<name> 子路径导出
- shadow-docs/knowledge/blog-detail.md — 详情页排版参数与分享区结论（本次更新）

## 决策

- **选型:** 方案 A——页面级实现原型 cbtn 圆钮分享行（并入 ArticleColophon）+ 极简 Divider 组件（hairline/ornament）替换结构线 + 正文 15.5px/1.85/680px
- **对比方案:** B 改造 SharedLinkGroup 默认形态（改公共组件语义与 icon API，唯一消费方场景收益不成比例）；C 加 pill/circle 双 variant（无第二消费方，过度设计）
- **理由:** 原型注释明写「与 SharedLinkGroup SShareButton 同款圆形图标钮；无循环关键帧」，页面需要无标签、入 colophon、去循环动画的变体，页面级实现完全掌控且不碰组件语义；颜色全走语义 token 根治主题失联。SharedLinkGroup 与 alert/dialog/link-group/message/result 的 prefers-color-scheme 问题另开任务统一治理。分享 8 项数据构造与图标全部复用现状。

## 任务

### Phase 1 分享区对齐原型

- [x] PostView 移除 SharedLinkGroup 引用，分享数据改页面本地 ShareAction（8 项：6 预设 + 分享图/导出全文），图标从 @wuh.site/components/icons 引入 — apps/site/app/post/PostView/index.tsx — 改动
- [x] post-article.ts 新增 ColophonShareRow + ShareIconButton（40×40 圆形、background-200 底、normal-300 描边、hover 上浮放大 + 描边消隐 + 朱砂、focus ring、--motion-* tokens、无循环关键帧、reduced-motion 降级），渲染位置在 ColophonMeta 之后 ColophonTools 之前 — apps/site/app/post/styles/post-article.ts — 改动
- [x] styles barrel 导出 ColophonShareRow / ShareIconButton — apps/site/app/post/styles/index.ts — 改动

### Phase 2 Divider 组件

- [x] 实现 Divider：variant hairline（默认发丝线）/ ornament（中置朱砂点缀），颜色全语义 token、无 prefers-color-scheme — packages/components/divider/index.tsx, specs.tsx, styles/index.tsx — 新增
- [x] exports map 注册 divider 入口 + 补 readme — packages/components/package.json, packages/components/divider/readme.md — 改动

### Phase 3 结构线替换

- [x] ArticleColophon border-top/bottom 改由 Divider 渲染（容器去 border） — apps/site/app/post/PostView/index.tsx, apps/site/app/post/styles/post-article.ts — 改动
- [x] 评论区「评论 (N)」标题上缘结构线换 Divider — apps/site/app/post/components/PostComments/index.tsx, apps/site/app/post/components/PostComments/styles/index.tsx — 改动

### Phase 4 正文排版收紧 + 验证

- [x] 正文 16→15.5px、行高 1.92→1.85、栏宽 700→680px（约 43 字/行），h2 23 / h3 20 与移动端 15px/1.85 不动 — apps/site/app/post/styles/post-markdown.ts, apps/site/app/post/styles/post-layout.ts — 改动
- [x] cd apps/site && pnpm exec tsc --noEmit（存量错误不新增）；wine/plain × light/dark 四主题视检分享区/分割线/正文密度 — 验证

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/blog-detail.md, shadow-docs/knowledge/components.md
- **理由:** blog-detail.md 排版参数与分享区结论变化；components.md 增补 Divider 条目
