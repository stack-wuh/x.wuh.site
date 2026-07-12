# 任务清单

## Phase 1: Button 替换 — 简单按钮

### Task 1: 替换 FloatingButton/LikeButton (post-floating)

- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-floating.ts`
- [ ] 删除 `FloatingButton`、`LikeButton` 的 `styled.button` 定义
- [ ] **文件:** `packages/wuh.site.next/app/post/components/FloatingActions.tsx`
- [ ] 导入 `Button` from `@wuh.site/components/button`
- [ ] 将 `FloatingButton` 替换为 `<Button variant="outlined" color="secondary" size="small">`
- [ ] 将 `LikeButton` 替换为 `<Button variant="outlined" color="primary" size="small">` + `icon={<IconThumbUp />}`
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误

### Task 2: 替换 ThemeToggle/MobileToggle/MobileActionButton (SiteHeader)

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 删除 `MobileToggle`、`ThemeToggle`、`MobileActionButton` 的 `styled.button` 定义
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`
- [ ] 导入 `Button` from `@wuh.site/components/button`
- [ ] 替换三个按钮为 Button 组件
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误

### Task 3: 替换 ThemeChip (system-color)

- [ ] **文件:** `packages/wuh.site.next/app/design/system-color/page.tsx`
- [ ] 删除 `ThemeChip` 的 `styled.button` 定义
- [ ] 导入 `Button` from `@wuh.site/components/button`
- [ ] 替换为 Button 组件，用 variant 切换表达 active 状态
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误

### Task 4: 替换 ComposerSend/ComposerBadge (guestbook-barrage)

- [ ] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [ ] 删除 `ComposerSend`、`ComposerBadge` 的 `styled.button` 定义
- [ ] **文件:** `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- [ ] 导入 `Button` from `@wuh.site/components/button`
- [ ] 替换 ComposerSend 和 ComposerBadge 为 Button 组件
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误

## Phase 2: Button 替换 — 复杂按钮

### Task 5: 替换 GuestbookTrigger

- [ ] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [ ] 将 `GuestbookTrigger` 的 `styled.button` 改为 `styled(Button)` 扩展，保留自定义布局
- [ ] **文件:** `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- [ ] 更新 `GuestbookTrigger` 的使用方式
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误

### Task 6: 替换 ActionArea (ContactCard)

- [ ] **文件:** `packages/wuh.site.next/app/components/ContactCard.tsx`
- [ ] 评估是否可将 ActionArea 替换为 Button（因其支持 as prop 和 href）
- [ ] 如可用 Button 替换则替换，否则使用 styled(Button) 扩展
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误

### Task 7: 替换 GuestbookSubmit (about/styles.ts)

- [ ] **文件:** `packages/wuh.site.next/app/about/styles.ts`
- [ ] 查看 GuestbookSubmit 的 `styled.button` 定义
- [ ] 替换为 Button 组件或 styled(Button) 扩展
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误

## Phase 3: 验证与收尾

### Task 8: SVG 使用审计

- [ ] 确认 `packages/wuh.site.next/` 中无 `<svg` 标签
- [ ] 如有发现，替换为对应的 `@wuh.site/components/icons` 组件
- [ ] **验证:** `rg -F '<svg' -g '*.tsx' packages/wuh.site.next/` 返回空

### Task 9: 最终验证

- [ ] `pnpm exec tsc --noEmit` 零错误
- [ ] `pnpm build:next` 构建成功
- [ ] 提交前做视觉对比检查

## 验收

- [ ] 所有 `styled.button` 在业务代码中被替换为 Button 组件或 styled(Button) 扩展
- [ ] 业务代码无内联 SVG
- [ ] `npx tsc --noEmit` 零错误
- [ ] `pnpm build:next` 成功

## Phase 4: Image 替换

### Task 10: 替换 AboutView GitHub 头像

- [ ] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`
- [ ] 导入 `Image` from `@wuh.site/components/image`
- [ ] 替换 `<img src={avatarUrl} ... />` 为 `<Image src={avatarUrl} ... />`
- [ ] 保留 borderRadius、width/height 等样式
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误

### Task 11: 替换 PostCover 博文封面

- [ ] **文件:** `packages/wuh.site.next/app/post/components/PostCover.tsx`
- [ ] 导入 `Image` from `@wuh.site/components/image`
- [ ] 替换 `<img src={src} ... />` 为 `<Image src={src} ... />`，移除手动 onError 处理
- [ ] `CoverImage` wrapper 保留
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误
