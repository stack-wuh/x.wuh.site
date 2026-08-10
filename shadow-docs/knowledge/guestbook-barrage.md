---
title: 留言板群聊弹窗
domain: guestbook
keywords: [留言板, 群聊弹窗, About页, 主题雾化, 减少动态, 缓存昵称, Dialog, 留言代理, 匿名留言, dev构建隔离]
scope:
  - packages/wuh.site.next/app/about
  - packages/wuh.site.next/app/guestbook
  - packages/wuh.site.nest/src/modules/comment
status: active
source:
  - changes/archive/20260705-P-about-guestbook-chat-ui/brief.md
  - changes/archive/20260705-P-message_barrage_dialog/brief.md
verified: 2026-08-08
---

# 留言板群聊弹窗

## 当前结论

About 页面留言板入口使用聊天语义（头像、标题、预览文案、CTA），hover/focus 时以 `--primary-color` 从左向右自然衰减形成单向主题雾化渐变，基于 `--background-100` 纸张基底，亮色与暗色主题下保持文字清晰可读。不使用位移、缩放或强阴影反馈。

入口背景、边框、文字状态统一使用 `220ms ease` 过渡，`prefers-reduced-motion: reduce` 时取消渐进动画直接呈现目标状态。左侧强调线、交互边框和 CTA 使用当前 `--primary-color`。

弹窗为群聊式消息流：已有留言左侧气泡展示，新发送留言右侧气泡展示，头像使用昵称首字符。输入框限 100 字符，本地缓存昵称，点击发送即提交至 `/api/comments`，气泡内显示发送状态。

Next.js 留言代理失败时返回可读 JSON 并输出 `[guestbook]` 前缀错误日志。匿名留言使用 UUID externalId，兼容 GitHub 同步数字查询。dev 与 build 输出目录隔离（dev → `dist/wuh.site.next-dev`，生产 → `dist/wuh.site.next`）。

Dialog Header 展示标题「留言板」和副文本「声无哀乐」，Body 顶部引导短语「萍水楚客，路远情长」。subtitle 为可选 prop，未传时不渲染额外 DOM。

## 执行约束

- 留言入口和弹幕弹窗保持聊天语义、主题 token、键盘操作与 reduced-motion；提交必须走统一评论接口。

## 适用边界

不约束博客文章评论区的布局。

## 验证方式

检查 About 入口、Guestbook dialog/composer 及评论 API 调用；验证键盘提交、焦点和 reduced-motion。

## 关联知识

- [guestbook virtual scroll](./guestbook-virtual-scroll.md)
- [contact dialog](./contact-dialog.md)
