# 任务清单

## Task 1: 创建规范文件
- [ ] 新增 packages/wuh.site.next/CODE_STYLE.md
- [ ] 包含文件长度、注释、样式组织三个约定

## Task 2: 拆分 app/post/styles/index.ts
- [ ] 按板块拆为 post-content.ts、post-toolbar.ts、post-toc.ts
- [ ] 在 index.ts 统一 re-export
- [ ] 更新所有引用路径

## Task 3: 拆分 app/HomeView.tsx
- [ ] 样式拆到 HomeView.styles.ts
- [ ] 子组件拆到 components/
- [ ] 补充 JSDoc

## Task 4: 拆分 app/blog/BlogListView.tsx
- [ ] 样式拆到 blog/styles/index.ts
- [ ] 补充 JSDoc

## Task 5: 拆分 app/components/SiteHeader.tsx
- [ ] 样式拆到 SiteHeader/styles/index.ts
- [ ] 补充 JSDoc
