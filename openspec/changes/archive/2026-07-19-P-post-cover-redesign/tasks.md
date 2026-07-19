---
artifact: tasks
contractVersion: 1
requiredHeadings:
  - 任务清单
  - 验收
requiredPatterns:
  - '^## Phase .+'
  - '^### Task .+'
  - '^- \[ \] \*\*文件:\*\* .+'
---

# 任务清单

## Phase 1: 后端封面契约与回退去重

### Task 1: 为隐藏元数据和首图回退补充失败测试

- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/content-metadata.util.spec.ts`、`packages/wuh.site.nest/src/modules/content/content-cover.util.spec.ts`、`packages/wuh.site.nest/src/modules/content/content.controller.spec.ts`
- [ ] 先覆盖合法/非法 `wuh-site-metadata` 注释的解析与清理行为。
- [ ] 先覆盖显式封面保留正文首图、首图回退同时清理 Markdown 与 HTML 的详情响应行为。
- [ ] 在实现前运行定向 Jest，记录预期失败证据。
- [ ] **预计耗时:** 40 分钟
- [ ] **验证:** `pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts`

### Task 2: 实现元数据清理和双格式首图去重

- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/content-metadata.util.ts`、`packages/wuh.site.nest/src/modules/content/content-cover.util.ts`、`packages/wuh.site.nest/src/modules/content/content.controller.ts`、`packages/wuh.site.nest/src/modules/sync/sync.service.ts`
- [ ] 抽取可测试的隐藏元数据解析/清理函数并让同步服务复用它。
- [ ] 扩展封面工具，使首图回退时同时返回已去重的 Markdown 和 HTML。
- [ ] 更新详情 controller：显式封面仅移除隐藏元数据，回退封面移除同一张正文首图。
- [ ] 运行 Phase 1 的定向 Jest，记录从失败到通过的证据。
- [ ] **预计耗时:** 1 小时 20 分钟
- [ ] **验证:** `pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts`

## Phase 2: 共享类型、SEO 与详情页展示

### Task 3: 贯通 `coverAlt` 的 schema、共享类型和 SEO 映射

- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/schemas/content.schema.ts`、`packages/wuh.site.nest/src/modules/content/dto/content.dto.ts`、`packages/shared-contracts/src/index.ts`、`packages/wuh.site.next/app/post/PostView.types.ts`、`packages/wuh.site.next/app/post/[number]/page.tsx`
- [ ] 为 `coverAlt` 增加可选 schema、DTO、共享契约和前端 Issue 类型。
- [ ] 将 `coverAlt` 映射为 Open Graph 图片替代文本，缺省时回退文章标题。
- [ ] 保持 Twitter Card 与 JSON-LD 使用既有 cover URL，不新增 API 字段或请求。
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** `pnpm exec tsc --noEmit`

### Task 4: 重构文章开场区域并实现封面高度与动效

- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`、`packages/wuh.site.next/app/post/components/PostCover.tsx`、`packages/wuh.site.next/app/post/styles/post-header.ts`、`packages/wuh.site.next/app/post/styles/post-layout.ts`、`packages/wuh.site.next/app/post/styles/index.ts`
- [ ] 用单一 `PostLead` 结构组合 `PostCover` 和 `PostHeader`，通过 CSS 调整移动/桌面顺序。
- [ ] 移动端实现全宽、受限高度的封面；桌面端保留主阅读栏内的克制横图。
- [ ] 添加短暂加载入场动效和 `prefers-reduced-motion` 降级，不创建重复封面节点。
- [ ] **预计耗时:** 1 小时 30 分钟
- [ ] **验证:** `pnpm exec tsc --noEmit`，并在 390px 与 1440px 视口进行实际页面截图检查。

## Phase 3: 集成验证

### Task 5: 验证封面数据、响应式布局与无障碍降级

- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/content-metadata.util.spec.ts`、`packages/wuh.site.next/app/post/`
- [ ] 验证显式封面、首图回退、无图文章三种详情响应。
- [ ] 验证移动端封面在标题前且高度受限，桌面端封面不侵入目录栏。
- [ ] 验证 `prefers-reduced-motion: reduce` 下封面不播放自身入场动效。
- [ ] **预计耗时:** 40 分钟
- [ ] **验证:** 后端定向 Jest、`pnpm exec tsc --noEmit`、Playwright 桌面/移动截图

## 验收

- [ ] GitHub Issue 的 `wuh-site-metadata` 注释可声明 `cover` 和 `coverAlt`，且不会进入详情页正文或 description。
- [ ] 显式封面与第一张正文图片可同时存在；无显式封面时，回退首图不会在正文重复出现。
- [ ] `coverAlt` 能用于详情页封面和 Open Graph 图片替代文本，旧内容回退文章标题。
- [ ] 移动端封面先于文章标题、全宽且高度限制为 220–300px；桌面端封面保留在主阅读栏内且最大高度为 360px。
- [ ] `prefers-reduced-motion: reduce` 下封面动效禁用。
- [ ] `pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts` 通过。
- [ ] `pnpm exec tsc --noEmit` 零错误。
