# Alert 组件与博客详情页冗余信息

## 为什么做

博客详情页缺少统一的冗余信息提示组件。现有 Alert 占位实现引用了不存在的 scss 文件，需要重构为可用的 styled-components 实现，并接入页面展示文章更新时间、原文链接、标签、版权说明等信息。

## 做什么

- 重构 `packages/components/alert/` 为可复用 Alert 组件
- 在 PostView.tsx 接入 Alert，展示：更新时间（具体到分钟）、文档原链接（去掉 GitHub 域名）、文档标签、版权说明、所属 Project（支持点击跳转）
- 将分享组件放入 Alert 区域
- Alert 组件不需要支持点击关闭
- 后续拆分为 Meta Card + Share Card 双卡片结构
- 元信息字段单行不换行，label: value 结构前加 Icon（hover 旋转 360 度）

## 影响范围

- `packages/components/alert/` — 重构
- `packages/wuh.site.next/app/post/PostView.tsx` — 接入 Alert
- `packages/wuh.site.next/app/post/styles/index.ts` — 样式调整
