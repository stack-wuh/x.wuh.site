---
{
  "schema": "shadow-dev/v1",
  "name": "20260906-style-post-detail-skeleton-sync",
  "type": "style",
  "scope": "site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20260906-style-post-detail-skeleton-sync",
  "files": [
    "apps/site/app/post/[number]/loading.tsx",
    "apps/site/test/post-skeleton-layout-sync.test.mjs"
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
    "verifiedCommit": "7a8c2bf9ebd733ea0fc06e07e4cf3425e0afb561",
    "verifiedAt": "2026-09-06T07:04:34.092Z"
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

# 博客详情骨架屏：整页镜像终态布局

## 动机

`/post/[number]` 现有骨架屏仍是旧「边框文章卡」语言：页头顺序错（标题在 meta 前）、无 16:9 封面杂志卡、无继续阅读/牌记/评论/工具条区域，侧栏还是带边框旧卡片——与当前终态布局逐块错位，加载阶段产生明显布局跳动与视觉割裂。用户要求骨架屏与页面布局同步。

## 引用规范

- norms/ui-patterns.md（shadow-dev-workflow 通用）
  - 当前结论: 组件复用优先（组件库已有 Skeleton）；暗色全覆盖走 token；响应式三档；动效 150–300ms 且响应 reduced-motion；禁止布局位移类动画
  - 适用 scope: 跨项目 UI 变更
- norms/interaction.md（shadow-dev-workflow 通用）
  - 当前结论: 异步操作显示加载态，skeleton 优于 spinner
  - 适用 scope: 跨项目交互
- norms/code-style-frontend.md（shadow-dev-workflow 通用）
  - 当前结论: loading 状态遵循 App Router 目录约定（`loading.tsx`）；组件明确处理 loading 等可见状态
  - 适用 scope: 前端
- shadow-docs/knowledge/blog-detail.md
  - 当前结论: 注记式页头构图（meta 行左 + 藏印标签右、衬线大标题、朱砂短规收束）；封面 order 桌面标题区在上/移动端封面出血在上；右侧 sticky 目录与操作区（目录 → 操作钮 → 前后篇 → 信息行，发丝线分区）
  - 适用 scope: apps/site/app/post
- shadow-docs/knowledge/post-cover.md
  - 当前结论: 有封面为 16:9 杂志卡（1px 主题色细边 + 12px 圆角 + 底部轻渐变），移动端出血通栏；无封面生成式封面同壳同尺寸
  - 适用 scope: apps/site/app/post/components/PostCover、styles/post-header.ts、PostView

## 决策

- **选型:** 方案 A——骨架复用终态真实布局 styled 组件搭壳（`Container / ContentGrid / MainColumn / TocAside / PostLead / CoverFrame / HeadRule / TopRow` 等，以 styles 桶实际导出为准），块内填组件库 `Skeleton`（text/rect/circle + shimmer）。统一 16:9 封面占位（终态两种封面形态同壳同尺寸，hydrate 跳动最小）。整页镜像：页头 → 封面 → 章节正文 → 继续阅读 → 牌记 → 评论 → 工具条 + 侧栏。
- **对比方案:** 方案 B 骨架自持复制度量——放弃：双份度量必然再次漂移，即本次问题根因；方案 C 拆 Suspense 流式——放弃：需重构 `getIssue` 一次取数与 ISR 缓存结构，风险远超需求边界。
- **理由:** 布局度量单一事实源——终态布局未来变更时骨架自动跟随，根治漂移；首屏 CLS≈0；Skeleton shimmer 自带 token 配色与 reduced-motion 降级，满足暗色与动效规范；不新增组件，复用组件库 Skeleton。
- **默认量与近似:** 藏印 1 枚、目录 3 条、继续阅读 3 则、分享圆钮 8 枚（终态固定数）、评论 1 条 + 表单；summary 引用块不镜像。评论区样式由 PostComments 自持未进 styles 桶，骨架以本地 styled 近似其纵向节奏（CommentsSection/CommentItem），其余区域全部复用导出壳。
- **待确认点:** 无剩余——侧栏发丝线分区经 TocTools/TocPrevNext/TocInfo 复用落实。

## 任务

### Phase 1

- [x] 重写整页镜像骨架 — `apps/site/app/post/[number]/loading.tsx` — 复用终态布局 styled 搭壳 + Skeleton 填块；移动端随真实断点折行/封面出血；全区 aria-hidden
- [x] 布局同步防漂移测试 — `apps/site/test/post-skeleton-layout-sync.test.mjs` — 断言 loading.tsx 从 `../styles` 复用布局壳组件（Container/ContentGrid/CoverFrame 等）且不再出现旧 ArticleCard 语言

### Phase 2

- [x] 浏览器可视化验证 — 流式首 chunk 与抢拍截图对比 skeleton 与终态逐块对齐（桌面亮色 + 移动端断言）— 记录截图
- [x] 回归 — `apps/site/test/` 全套 + `tsc --noEmit`

## 结果

- 实际耗时: 约 1 会话内完成（含 TDD 红→绿）
- 验证: 防漂移测试 4/4 绿（先红后绿）；全套测试 106 通过、4 失败均为 main 既存过期断言/并行抖动（avatar role、related-posts thread-in-card、alert labels、blog 行整行点击），与本次改动文件无交集；`tsc --noEmit` 通过；桌面亮色抢拍截图确认骨架逐块镜像终态（页头 meta/藏印/标题/朱砂短规、16:9 封面卡、侧栏目录→操作→前后篇→信息四段发丝线分区）；SSR 流式首 chunk 含 SkeletonRoot 与 div 态 TocMobile 标记；移动端 fallback 窗口断言 TocAside display:none、封面出血（left -8 / width 391 @ vw 375）与终态一致

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/blog-detail.md
- **理由:** 可补一句「骨架屏整页镜像终态布局（复用布局壳组件，评论区近似）」；ship 阶段写入

