---
title: 博客详情页排版
domain: blog
keywords: [博客详情, 排版, 字号, 行高, 对比度, 封面, 相关文章, 标签链接, 阅读余韵]
scope:
  - packages/wuh.site.next/app/post
  - packages/wuh.site.next/app/post/[number]
status: active
source:
  - changes/archive/博客详情页排版优化_2026_05_17/brief.md
  - changes/archive/20260524_P_post_toolbar_redesign/brief.md
  - changes/archive/20260729_B_restore-post-toc/brief.md
  - changes/20260823-feature-post-cover-redesign/brief.md
verified: 2026-08-23
---

# 博客详情页排版

## 当前结论

酒红主题：正文 16px、行高 1.8、h1/h2 为 30px；素雅主题：正文 16px、行高 2.0、h1/h2 为 27px。移动端（max-width 640）行高收紧：酒红 1.7、素雅 1.8，h1/h2 字号不变。`--text-primary` 与背景对比度 >= 4.5:1，`--text-secondary` 与背景对比度 >= 3:1，代码块背景与字色对比度 >= 4.5:1。素雅 dark 模式所有 `--normal-*` 和 `--background-*` 变量有专属值，不继承酒红 dark。

封面图在标题/元数据下方、正文上方展示：有封面图为杂志卡（细边框 + 轻渐变），无封面图为生成式封面并承载 Header 信息（PostHeader 不重复渲染）。封面细节见 `post-cover.md`。

相关文章基于标签与时间排序、去重且最多 3 篇：每个标签并发请求最多 10 篇候选，按共享标签数降序、更新时间降序、编号升序排序。「继续阅读」模块以线索小径 + 轻卡片结构呈现：模块有与详情页一致的卡片边界，内部用左侧竖向线索线 + 圆点节点串起推荐项；计数「拾遗 N 则」，引导语取传统文气；hover 仅改变标题与箭头颜色并使箭头轻微右移。窄屏下单向触达高度不低于 44px。

文章标签链接使用 `buildTopicUrl` 生成 `/topics/<encoded>` 站内链接，不构造 GitHub Issue label query URL。Alert 组件区分站内外链接：外部域名设 `target="_blank"` + `rel="noopener noreferrer"`，站内路径同窗口导航。

## 执行约束

- 正文排版、目录锚点、前后篇工具栏和 slug 兼容必须一起回归；封面细节只引用 `post-cover.md`，不得在本卡重复定义。

## 适用边界

不约束博客列表卡片和封面解析的后端实现。

## 验证方式

检查 `PostView.tsx`、`components/PostToolbar.tsx`、目录组件和 `[number]/page.tsx`；验证数字与带 slug 路由均能取得同一文章。

## 关联知识

- [post cover](./post-cover.md)
- [blog code highlighting](./blog-code-highlighting.md)
- [seo](./seo.md)
