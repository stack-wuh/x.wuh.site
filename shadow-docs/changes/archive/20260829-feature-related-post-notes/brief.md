---
{
  "schema": "shadow-dev/v1",
  "name": "20260829-feature-related-post-notes",
  "type": "feature",
  "scope": "site",
  "status": "archived",
  "baseBranch": "main",
  "branch": "main",
  "files": [
    "apps/site/app/post/components/RelatedPosts/index.tsx",
    "apps/site/app/post/styles/post-article.ts",
    "apps/site/test/seo-p12-related-posts.test.mjs",
    "shadow-docs/knowledge/blog-detail.md"
  ],
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "916f2b7",
    "verifiedAt": "2026-08-29T17:54:02+08:00"
  },
  "workflow": {
    "checkpoint": "committed-on-main",
    "updatedAt": "2026-08-29T17:54:02+08:00"
  }
}
---

# 博客详情继续阅读改造

## 动机

博客详情页底部「继续阅读」模块仍是偏工具化的阅读索引，和当前网站更浪漫、文艺、有温度的整体风格不够一致。首版尝试「轻薄纸条」便签组，视觉上反而比正文更抢眼、更不协调，被否。改用可视化助手对比四个方向后，选定「线索小径 + 轻卡片结构」，文案再往传统文气里收一点。

## 决策

- 视觉方向采用线索小径 + 轻卡片：模块有与博客详情页一致的卡片边界，内部用左侧竖向线索线 + 圆点节点串起推荐项，不做便签纸、折角、错落与重阴影。
- 计数改为「拾遗 N 则」（“拾遗”取补录遗漏之意）；引导语「读罢意犹未尽，可循此间数条小径，再行一程。」。
- 推荐项保留标题、摘要、共享标签与箭头，标签呈现改为「线索 / x · y」，去掉数字序号（用 CSS 圆点节点替代）。
- 样式全部使用主题变量与 `color-mix`，保留移动端 44px 以上点击高度与 reduced-motion 处理。

## 任务

- [x] 更新 RelatedPosts 文案、计数单位与标签呈现，去掉数字序号。
- [x] 更新博客详情样式，从便签组改为轻卡片 + 线索小径。
- [x] 移除不再使用的 `RelatedPostIndex` 及其 re-export。
- [x] 更新聚焦测试，覆盖线索文案、竖线/圆点样式、44px 点击高度和 reduced-motion。
- [x] 浏览器预览检查桌面、移动端表现，确认无横向溢出。

## 结果

- 验证：`pnpm --dir apps/site exec node --test test/seo-p12-related-posts.test.mjs`，3/3 通过；`pnpm exec tsc --noEmit` 无错误。
- 预览：`/post/165` 显示「继续阅读 / 拾遗 3 则」与文言语引导；竖线 1px 渐变、圆点 9px 50%、链接 44px 无阴影无边框；移动端 44px 且无横向溢出。
- 已知非本次问题：预览环境仍存在既有 styled-components hydration mismatch / 500 资源错误日志。

## 知识评估

- 更新 `shadow-docs/knowledge/blog-detail.md`：继续阅读模块长期视觉结论调整为线索小径 + 轻卡片结构。

