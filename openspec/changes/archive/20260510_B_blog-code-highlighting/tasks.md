# 任务拆分

## Phase 1 — 依赖与工具

- [x] T1: 安装 unified 生态依赖，移除 marked
- [x] T2: 创建 `app/lib/markdown.ts` — unified pipeline 工具函数

## Phase 2 — 服务端适配

- [x] T3: 更新 `page.tsx` 在服务端预渲染 markdown

## Phase 3 — 客户端精简

- [x] T4: 更新 `PostView.tsx` 移除 marked
- [x] T5: 移除 CDN highlight.js 加载逻辑
- [x] T6: 简化 `useToc.ts`（移除 heading DOM 修改）

## Phase 4 — 样式修复

- [x] T7: 更新代码块 CSS（主题响应式 + hljs token 配色）

## Phase 5 — 验证

- [x] T8: oxlint 通过，tsc 无新增类型错误
- [x] T9: 手动验证（需用户在本地 dev server 确认代码块可读性）
