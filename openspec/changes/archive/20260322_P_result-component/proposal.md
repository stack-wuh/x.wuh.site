# Result 组件（404/500 错误页）

## 为什么做

页面 404/500 错误展示过于简单。需要新增 Result 组件用于错误页，引导用户前往 GitHub 或其他平台查看内容。

## 做什么

- 新增 Result 组件（含 404/500 展示形态）
- GitHub 风格卡片，提供引导链接
- 404/500 页面使用 Result 组件
- 支持自定义内容，后续可扩展更多场景
- 视觉上不空洞，强调下一步去向

## 影响范围

- `packages/components/result/` — 新增
- `packages/wuh.site.next/app/not-found.tsx` — 接入
- `packages/wuh.site.next/app/error.tsx` — 接入
