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

# 博客详情继续阅读便签风优化

## 动机

博客详情页底部「继续阅读」模块仍是偏工具化的阅读索引，和当前网站更浪漫、文艺、有温度的整体风格不够一致。用户选择「轻薄纸条」方向，并补充需要更多“人味”。

## 决策

- 视觉方向采用轻薄便签组：淡纸色背景、细边框、轻微错落、无重阴影。
- 模块加入作者口吻文案：「我想你也会喜欢这几篇，顺着这条线索，再翻几页。」
- 推荐项保留标题、摘要、共享标签与箭头，标签呈现改为「线索：daily」一类文本。
- 序号弱化为便签右上角装饰，设为 `aria-hidden`，避免重复干扰读屏。
- 样式全部使用主题变量与 `color-mix`，保留移动端 44px 以上点击高度与 reduced-motion 处理。

## 任务

- [x] 更新 RelatedPosts 文案、计数单位与标签呈现。
- [x] 更新博客详情样式，将继续阅读从无背景索引改为便签组。
- [x] 更新聚焦测试，覆盖便签文案、样式约束、44px 点击高度和 reduced-motion。
- [x] 浏览器预览检查桌面、移动端与暗色表现。
- [x] 子审查确认无 blocking issue。

## 结果

- 功能提交：`916f2b7 feat(site): 优化博客详情继续阅读模块`
- 验证：`pnpm --dir apps/site exec node --test test/seo-p12-related-posts.test.mjs`，3/3 通过。
- 预览：`/post/165` 显示「3 张便签」与作者口吻文案；移动端首张便签 `min-height: 44px`，无横向溢出。
- 已知非本次问题：预览环境仍存在既有 styled-components hydration mismatch / 500 资源错误日志。

## 知识评估

- 更新 `shadow-docs/knowledge/blog-detail.md`：继续阅读模块长期视觉结论从阅读索引调整为轻薄便签组。
