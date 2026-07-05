# 留言弹幕弹窗

## 背景

当前文章页底部只有留言占位提示，用户希望把留言区做成更接近 B 站的弹幕式交互：默认以弹幕区域为主，底部提供输入框，点击列表按钮后在同一屏内展开留言列表。这个交互需要同时兼顾桌面端和移动端，并且保留后续与 MongoDB 主库、GitHub 快照同步的扩展空间。

## 目标

- 在文章页提供一个弹窗形式的留言入口
- 弹窗默认展示弹幕区域，列表默认隐藏
- 输入框固定在底部，限制最多 100 个字符
- 点击列表按钮后，桌面端左右并列展示弹幕和列表
- 移动端改为上下布局，保证在窄屏下仍能同时查看弹幕和列表
- 弹幕和列表视觉风格参考 B 站的层次与信息密度

## 非目标

- 不在本次变更中实现 MongoDB 与 GitHub 快照同步逻辑
- 不在本次变更中实现弹幕速度、密度的后台配置化存储
- 不重做整套留言后端接口，只先完成前端交互落地
- 不修改文章正文内容与现有导航结构

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 入口与弹窗挂载点
- `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx` — 新增留言弹幕弹窗
- `packages/wuh.site.next/app/post/styles/post-guestbook.ts` — 新增弹窗相关样式
- `packages/wuh.site.next/app/post/styles/post-article.ts` — 如需调整文章页底部留白
- `packages/wuh.site.nest/src/modules/comment/*` — 仅在后续联调阶段可能继续复用

## 提案

采用“弹窗 + 双区布局 + 底部输入栏”的方案：弹窗内默认只展示弹幕区域，点击列表按钮后在桌面端展开右侧列表，在移动端展开下方列表。这样可以保持弹幕是主视觉，同时保留列表浏览能力，不会把留言区做成传统表单页。