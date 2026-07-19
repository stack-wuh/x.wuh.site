---
artifact: proposal
contractVersion: 1
requiredHeadings:
  - 背景
  - 目标
  - 非目标（明确不做）
  - 影响范围
requiredPatterns:
  - '^# .+'
---

# 重构博客详情页封面图体验

## 背景

当前博客详情页在 `metadata.cover` 缺失时，会把正文第一张图片推导为封面，并从详情正文中移除该图片以避免重复。这个回退逻辑让历史文章能够展示封面，但也让“文章第一张内容图”和“文章封面”无法同时存在。

移动端封面仍在文章内容栏中，缺少明确的文章开场；而桌面端现有的克制、阅读优先版式不适合直接套用跨越正文与目录的大型媒体头图。需要同时解决封面来源、旧文章兼容和两端差异化展示的问题，且不能破坏 GitHub Issues 作为 CMS 的日常写作体验。

## 目标

- 在 GitHub Issue 正文中支持用 HTML 注释声明可选的 `cover` 和 `coverAlt`，使显式封面不会作为可见的 Issue 或博客正文内容出现。
- 建立封面优先级：显式 `metadata.cover` 优先；没有显式封面时，兼容地回退到正文第一张图片。
- 仅在首图回退场景从博客正文移除被用作封面的图片；显式封面时保留正文中的所有图片。
- 移动端采用位于文章信息之前的全宽封面，桌面端保持封面位于主阅读栏内的克制布局。
- 为封面规定可预测的高度上限与轻量入场动效，并完整支持 `prefers-reduced-motion`。

## 非目标（明确不做）

- 不迁移或批量改写既有 GitHub Issues；未声明封面的文章继续按现有回退规则工作。
- 不引入新的图片托管服务、封面自动生成能力或后台编辑器。
- 不改变文章正文、评论、目录、相邻文章导航及分享功能。
- 不将桌面端改造成跨越正文与目录栏的大型全宽媒体头图。

## 影响范围

- `packages/wuh.site.nest/src/modules/sync/` — 解析 Issue 正文中的隐藏封面元数据并同步到内容 metadata。
- `packages/wuh.site.nest/src/modules/content/` — 明确显式封面和首图回退时的详情响应行为。
- `packages/shared-contracts/src/index.ts` — 为可选封面替代文本补齐共享 metadata 类型。
- `packages/wuh.site.next/app/post/` — 调整封面、文章头部和响应式布局，增加可访问的动效与高度约束。
- `openspec/specs/content-api/spec.md`、`openspec/specs/seo/spec.md`、`openspec/specs/design-system/spec.md` — 后续归档时同步封面来源、元数据与动效规范。
