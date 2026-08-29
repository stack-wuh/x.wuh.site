---
{
  "schema": "shadow-dev/v1",
  "name": "20260830-P-shiki-highlighting",
  "type": "feature",
  "scope": "site",
  "status": "proposed",
  "baseBranch": "main",
  "files": [
    "apps/site/app/lib/markdown.ts",
    "apps/site/app/post/styles/post-markdown.ts",
    "package.json",
    "pnpm-lock.yaml"
  ],
  "workflow": {
    "checkpoint": "proposed",
    "updatedAt": "2026-08-30"
  }
}
---

# 代码高亮迁移到 Shiki

## 动机

博客正文代码高亮现用 `rehype-highlight`（highlight.js），基于正则匹配，高亮精度与层次感不如 Shiki 的 TextMate 语法（VS Code 同款）。Shiki 原生支持双主题（light/dark），可对接站点 `data-color-scheme`。

## 决策

- 渲染管线 `rehype-highlight` → `@shikijs/rehype`，主题 `github-light` / `github-dark`。
- 双主题对接：Shiki 输出 `--shiki-light` / `--shiki-dark` CSS 变量，用 `[data-color-scheme="dark"]` 选择器切换，复用站点现有主题属性。
- 行号暂不加（纯 CSS counter 效果不佳）。
- 复制按钮为独立 DOM 功能（读 `pre code` 文本），迁移不受影响。

## 任务

- [ ] 安装 `@shikijs/rehype`，移除 `rehype-highlight`
- [ ] `markdown.ts` 替换高亮插件为 `rehypeShiki`（双主题）
- [ ] `post-markdown.ts` 删除 `.hljs-*` 样式，加 Shiki 双主题切换 CSS
- [ ] 回归：代码高亮、复制按钮、4 主题、行内 code 不受影响

## 结果

- 待实现

## 知识评估

- 实现并回归通过后，更新 `blog-code-highlighting.md`（高亮引擎从 highlight.js 改为 Shiki）。
