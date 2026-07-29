# 任务清单

## Phase 1: 回归约束

### Task 1: 增加目录根因回归检查

- [x] **文件:** `packages/wuh.site.next/test/post-detail-runtime-regression.test.mjs`
- [x] 验证详情页在 `body` 非空时调用统一 `renderMarkdown`，不再优先短路返回 `body_html`
- [x] 检查回退分支仍覆盖 `body` 缺失且 `body_html` 有效的场景
- **预计耗时:** 20 分钟
- **实际耗时:** 约 10 分钟
- [x] **验证:** 运行详情页 Node 回归测试；RED 阶段先失败，GREEN 阶段通过

## Phase 2: 最小实现

### Task 2: 调整详情页正文渲染优先级

- [x] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`
- [x] 修改 `ensureRenderedBody`，优先使用 `body` 调用 `renderMarkdown`
- [x] 保留有效 `body_html` 回退和无正文错误
- **预计耗时:** 15 分钟
- **实际耗时:** 约 5 分钟
- [x] **验证:** 详情页回归测试通过；实现复用 `renderMarkdown` 生成带标题 `id` 的 HTML

### Task 3: 同步博客详情规范

- [x] **文件:** `openspec/specs/post/spec.md`
- [x] 增加正文标题锚点与目录展示的 GIVEN/WHEN/THEN 需求
- **预计耗时:** 10 分钟
- **实际耗时:** 约 5 分钟
- [x] **验证:** 规范内容与实现设计一致，无冲突或占位符

## Phase 3: 回归验收

### Task 4: 执行工程质量检查

- [x] **文件:** 相关前端包
- [x] 运行详情页回归测试、前端 lint 和 TypeScript 类型检查
- [x] 检查 `git diff --check`
- **预计耗时:** 30 分钟
- **实际耗时:** 约 5 分钟
- [x] **验证:** 回归测试、类型检查和 diff 检查通过；lint 仅报告既有 `GuestbookGuide` 未使用警告

## 验收

- [x] Markdown 含 `h1`、`h2` 或 `h3` 时，详情页目录正常展示
- [x] 正文标题包含 `id`，目录链接可定位对应标题
- [x] `body` 为空时，有效 `body_html` 仍可作为回退正文
- [x] 详情页已有正文、相关文章、评论和响应式布局不回归
- [ ] `pnpm --filter @wuh.site/next run lint` 零错误（当前仅有既有 warning）
- [x] `pnpm exec tsc --noEmit` 零错误
