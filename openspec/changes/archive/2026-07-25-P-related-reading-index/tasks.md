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

## Phase 1: 回归约束与模块结构

### Task 1: 建立阅读余韵索引回归契约

- [ ] **文件:** `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs`
- [ ] 将现有“轻量列表”断言升级为索引头部、数量、序号、可选摘要、文本标签和无卡片约束。
- [ ] 断言整项链接有可访问名称，箭头为非交互装饰，样式包含 reduced-motion 分支。
- [ ] **预计耗时:** 20 分钟；**实际耗时:** 待执行。
- [ ] **验证:** `node --experimental-strip-types --test packages/wuh.site.next/test/seo-p12-related-posts.test.mjs` 在生产代码变更前失败。

### Task 2: 实现详情页索引语义结构

- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [ ] 将“相关文章”标题替换为“继续阅读”索引头部，显示准确数量和菱形装饰语义。
- [ ] 为每项渲染两位序号、标题、仅在有值时出现的摘要、格式化共享标签与 aria-hidden 箭头。
- [ ] 保持 `relatedPosts.length > 0` 条件、`buildPostUrl` 内链和单一整项链接语义。
- [ ] **预计耗时:** 35 分钟；**实际耗时:** 待执行。
- [ ] **验证:** 阅读 JSX，确认无额外链接、无数据层或 API 修改。

## Phase 2: 视觉、响应式与无障碍实现

### Task 3: 实现编辑型索引样式与导出

- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-article.ts`, `packages/wuh.site.next/app/post/styles/index.ts`
- [ ] 使用现有 token 实现分隔线、CSS 菱形、三列 grid、两行摘要截断、文本标签和整项焦点状态。
- [ ] 删除或替换现有相关文章通用列表样式，确保无卡片背景、外层圆角、阴影与抬升 transform。
- [ ] 在 640px、420px 和 reduced-motion 媒体规则中处理换行、44px 触达和箭头动效降级。
- [ ] **预计耗时:** 50 分钟；**实际耗时:** 待执行。
- [ ] **验证:** 复查样式只使用既有 CSS token；不产生横向滚动选择器风险。

## Phase 3: 集成验证

### Task 4: 验证相关文章行为与视觉契约

- [ ] **文件:** `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs`, `packages/wuh.site.next/app/post/PostView.tsx`, `packages/wuh.site.next/app/post/styles/post-article.ts`
- [ ] 运行相关文章回归测试与相关结构化数据测试，确认 SEO 内链和 Breadcrumb JSON-LD 不受影响。
- [ ] 执行差异检查，检查无意外修改和样式契约。
- [ ] **预计耗时:** 20 分钟；**实际耗时:** 待执行。
- [ ] **验证:**
  - `node --experimental-strip-types --test packages/wuh.site.next/test/seo-p12-related-posts.test.mjs`
  - `node --experimental-strip-types --test packages/wuh.site.next/test/seo-p1-structured-data.test.mjs`
  - `git diff --check`

## 验收

- [ ] 有相关文章时，正文后展示“继续阅读”和准确的文章数量；无相关文章时不显示模块。
- [ ] 每项为一个可聚焦的整行链接，包含序号、标题、可选摘要、文本化共享标签和装饰箭头。
- [ ] 桌面端无外层卡片、背景、阴影、圆角容器或 hover 抬升。
- [ ] 375px 视口无横向滚动，单项触达高度不低于 44px。
- [ ] 减少动态偏好下不发生箭头位移。
- [ ] 相关文章选择、上限、站内 canonical 内链和结构化数据保持不变。
