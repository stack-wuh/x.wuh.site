---
{
  "schema": "shadow-dev/v1",
  "name": "20260829-P-post-typography-design-language",
  "type": "feature",
  "scope": "site",
  "status": "applied",
  "baseBranch": "main",
  "files": [
    "apps/site/app/post/styles/post-markdown.ts",
    "apps/site/app/post/styles/post-article.ts",
    "apps/site/app/post/styles/index.ts",
    "apps/site/app/post/PostView/index.tsx",
    "apps/site/test/post-typography-design-language.test.mjs",
    "shadow-docs/knowledge/blog-detail.md"
  ],
  "workflow": {
    "checkpoint": "applied",
    "updatedAt": "2026-08-29"
  }
}
---

# 博客详情页正文设计语言

## 动机

博客详情页正文沿用 GitHub markdown 排版（无衬线正文、标题下划线、背景盒引用块、默认列表 marker），与站点整体文艺书页气质不符。经可视化助手多轮对比（密度、响应式、边距、各元素逐一确认），确定一套完整的正文设计语言，作为实现依据。

## 决策

### 字体角色（三层分工）
- 正文 / 标题：衬线 `--font-serif`（Noto Serif SC）
- 辅助（时间 / 标签 / 计数 / 更新提示）：无衬线 `--font-sans`（Noto Sans SC）
- 代码：等宽 `--font-mono`（JetBrains Mono）

### 字号阶梯
- 桌面：h1 26 · h2 18–20 · h3 16–17 · h4 15 · 正文 14–15 · 辅助 12
- 移动端（≤640）：h2 17 · h3 15 · 正文 14 · 辅助 11

### 行高
- 桌面：正文 1.55（极紧凑）/ 1.7（紧凑）/ 1.75（舒适）三档，标题 1.3
- 移动端（≤640）：正文 1.5（在任意档上再收一档）

### 字间距
- 正文 0 · 标题 +0.02em · 辅助 +0.04em

### 标题
- 去 `border-bottom` 下划线，h2 左侧 3px accent 短竖线（高度随字号，`calc(h2 * 1.1)`）

### 段落 / 列表 / 引用
- 段落间距：桌面 14–20 / 移动 12
- 无序列表：accent 圆点 marker（替换默认黑点）；有序：衬线数字
- 引用块：去背景盒与圆角，只留左侧 2px accent 竖线 + 文字缩进（书页式引文）

### 图片
- 通栏 + `max-height: 340px` + 圆角 6px 细边 + 居中无衬线 figcaption

### 表格
- 仅横向细线（无竖线），th 用 accent 下划线 + 衬线，末行去线

### 分割线
- 居中短横 + 中央空心圆环 ○（纯 CSS `border-radius: 50%`，不用易失真的 Unicode 符号）

### 更新提示
- 文章末尾统一「── 更新于 X ──」带字线，无衬线小字 + 两侧 accent 细线；数据源 `issue.updated_at`

### 响应式边距
- 正文容器边距：桌面 26px / 移动 12px；引用块内边距桌面 10px 16px / 移动 8px 12px 起，随密度档缩放

## 任务

- [ ] 实现 `post-markdown.ts` 排版样式（字体 / 字号 / 行高 / 标题 / 引用 / 列表 / 图片 / 表格 / 分割线）
- [ ] 实现末尾「更新于 X」提示（数据源 `issue.updated_at`）
- [ ] 回归：目录锚点、代码高亮、封面、工具栏、继续阅读不受影响
- [ ] 验证 4 主题（wine/plain × light/dark）+ 移动端断点

## 结果

- 实现完成：`post-markdown.ts` 排版重写（衬线 14px/1.55、标题短竖线、引用去背景盒、列表 accent 圆点、图片限高、表格横向细线、分割线圆环）+ `PostView` 末尾「更新于 X」提示。
- 验证：`post-typography-design-language.test.mjs` 8/8 通过；回归 17/17（image-role / related-posts / post-detail 均未破坏）；`tsc --noEmit` 通过。
- 浏览器实测 `/post/165`：正文 `notoSerifSC` 14px/1.55、标题 18px 去下划线、引用去斜体去背景、末尾「更新于 2026-07-05」；移动端 375px 行高自动收到 1.5。

## 知识评估

- 已写入 `shadow-docs/knowledge/blog-detail.md` 的「当前结论」，替换旧的 GitHub 风格排版描述。
