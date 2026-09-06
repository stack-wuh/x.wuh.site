---
{
  "schema": "shadow-dev/v1",
  "name": "20260906-style-post-header-seal-tag",
  "type": "style",
  "scope": "site",
  "status": "archived",
  "baseBranch": "main",
  "files": [
    "apps/site/app/post/components/PostHeader/index.tsx",
    "apps/site/app/post/styles/post-header.ts",
    "shadow-docs/knowledge/icon-system.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": null,
    "issueUrl": null,
    "pullRequest": 372,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/372"
  },
  "workflow": {
    "checkpoint": "merged-pr:372",
    "updatedAt": "2026-09-06"
  },
  "branch": "style/20260906-style-post-header-seal-tag",
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "82f873cab426c09a16b70009f3ecf1dc5319fd4a",
    "verifiedAt": "2026-09-06T07:45:02.116Z"
  }
}
---

# 页头标签页签：回形针书签 → 朱砂藏印

## 动机

用户第三次否定页头标签页签形态：回形针书签的回形针骑线探出纸外，观感像「漂浮」在纸片上方的孤立图标，与纸片脱节；暗色下实底纸片更显笨重。用户圈出该页签要求重新设计。

## 决策

- 新形态为朱砂藏印（收藏印章），与封面画心朱砂印章同语言：双框印边（外 1px 朱砂 48% border + inset box-shadow 两层——纸色 1px 环 + 朱砂 20% 内框线）、印文疏排（无衬线 xs、letter-spacing 0.14em、右内 padding 以 `calc(10px - 0.14em)` 补偿末字距）、底为朱砂 5% 薄 tint、圆角 3px，无纸片实底。
- 整印微旋由标签名哈希在 ±1.6° 五个离散档位确定性推导（沿用禁 Math.random 防 hydration mismatch 约束）；hover/focus 时印章「落正」（rotate 归 0）且边框/底色/内框同步加深、印文转纯朱砂；reduced-motion 降级为 hover 保持静态微旋。
- 移除回形针层 + 纸片层两层结构，PostHeader 标签 `<a>` 直接承载印文；`IconPaperclip` 不再有业务引用（icons 库导出保留）。
- 容器 flex-wrap gap 8；继续 `buildTopicUrl` 站内链接；沿用不使用 clip-path 燕尾缺口与顶部色带的约束（燕尾、回形针分别为前两次被否定的迭代形态）。
- 顺带修复 main 上已失败的两份过期测试：`post-typography-design-language`（正文 p 度量、h2 眉线记号、hr 渐隐线均早已迭代）与 `post-detail-runtime-regression`（作者头像行早已移除），断言改为匹配当前实现。

## 任务

- [x] TagGroup 样式重写 — apps/site/app/post/styles/post-header.ts
- [x] PostHeader 结构简化 — apps/site/app/post/components/PostHeader/index.tsx
- [x] 过期断言修复 — apps/site/test/post-typography-design-language.test.mjs、post-detail-runtime-regression.test.mjs
- [x] Knowledge 更新 — shadow-docs/knowledge/blog-detail.md、icon-system.md

## 结果

- `pnpm exec tsc --noEmit` 通过；两份相关测试文件 12/12 通过；全套测试孤立复跑与 clean HEAD 一致（其余 3 个失败为与本次无关的既存过期断言：avatar role、alert labels、blog 行整行点击）。
- 浏览器实测 /post/165（单标签）与 /post/65（双标签 daily+weekly）：wine light/dark、plain light 下藏印形态均成立，双印并排微旋错落；375px 移动端 toprow 折行后印章行位于 meta 行下；hover 落正与印边加深如设计。

## 知识评估

- `blog-detail.md` 页头段落与 keywords 由「回形针书签」改写为「朱砂藏印标签」，并记录燕尾/回形针两次被否定形态的历史，防止回退。
- `icon-system.md` 导出清单示例改为不绑定业务引用的表述。
