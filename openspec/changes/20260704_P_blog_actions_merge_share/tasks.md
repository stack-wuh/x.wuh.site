# 任务清单

## Phase 1: 重构操作按钮组件

### Task 1: 重构 FloatingActions 为 ActionButtons

- [ ] **文件:** `packages/wuh.site.next/app/post/components/FloatingActions.tsx`
- [ ] 重命名为 `ActionButtons.tsx` 或直接在原文件中调整
- [ ] 调整按钮样式，参考 SharedLinkGroup 的圆形图标按钮
- [ ] 移除文字标签，改为纯图标+tooltip
- [ ] 横向排列，gap 间距与分享按钮一致
- [ ] **验证:** 组件渲染正常，样式符合设计

### Task 2: 调整 post-floating.ts 样式

- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-floating.ts`
- [ ] 删除独立卡片样式（边框、背景、padding）
- [ ] 改为简单的 flex 容器，横向排列
- [ ] 按钮样式参考 SharedLinkGroup 的 SShareButton
- [ ] 响应式：移动端自动换行
- [ ] **验证:** 样式符合设计稿

## Phase 2: 整合到分享卡片

### Task 3: 修改 PostView.tsx

- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [ ] 移除 RedundantInfoCard 和 ShareInfoCard 之间的 `<FloatingActions />`
- [ ] 在 ShareInfoCard 内部添加 ActionButtons 组件
- [ ] 调整 ShareCardInner 结构：ActionButtons 在上，分隔线，SharedLinkGroup 在下
- [ ] **验证:** 页面渲染正常，布局符合预期

### Task 4: 调整 ShareCardInner 样式

- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-article.ts`
- [ ] 在 ShareCardInner 中添加分隔线样式
- [ ] 控制 ActionButtons 和 SharedLinkGroup 之间的间距
- [ ] 确保移动端正确堆叠
- [ ] **验证:** 分隔线显示正确，间距合理

## Phase 3: 清理与验证

### Task 5: 删除未使用的代码

- [ ] 检查 `post-floating.ts` 是否还有其他地方引用
- [ ] 如无引用，删除或保留最小必要样式
- [ ] 删除 PostView 中不再使用的 import
- [ ] **验证:** 无编译错误

### Task 6: 响应式验证

- [ ] 桌面端预览：操作按钮和分享按钮分两行显示
- [ ] 移动端预览：按钮正确堆叠，无挤压溢出
- [ ] 交互验证：返回首页、回到顶部、点赞功能正常
- [ ] **验证:** 所有断点下布局和交互正常

## 验收

- [ ] 操作按钮成功融入分享卡片
- [ ] 桌面端分两行显示，移动端堆叠
- [ ] 按钮样式与分享按钮一致
- [ ] 所有功能（返回首页、回到顶部、点赞）正常工作
- [ ] 无 ESLint 错误
- [ ] `pnpm tsc --noEmit` 零错误
