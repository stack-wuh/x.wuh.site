# 重新设计404/500页面

## R1 — 404 页面 editorial 风格

移除 Result 组件和 GlobalLayout，改为 typography 驱动的开放布局：
- 大号 "404" 数字作为视觉焦点，使用 primary-color 点缀
- 标题 + 描述文字层次分明
- 操作按钮（返回首页 + 知识库链接）
- 无边卡、无阴影，融入网站整体氛围

## R2 — 500 页面 editorial 风格

与 404 页面保持一致的布局，额外提供 reset() 重试按钮。post/[number] 下的 500 页面使用博客相关文案。

## R3 — 移除冗余样式

删除 not-found.tsx 中的 `createGlobalStyle` body 样式覆盖，信任根 layout 的全局样式。

## R4 — 保留现有功能

以下功能不受影响：
- 404 页面：返回首页、GitHub/语雀/微信公众号链接
- 500 页面：重试按钮、返回首页、GitHub/语雀链接
- post/[number]/error.tsx：GitHub/知识库链接
