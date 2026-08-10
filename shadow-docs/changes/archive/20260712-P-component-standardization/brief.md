# 组件标准化

> 原始变更名：`2026-07-12-P-component-standardization`

## 元数据
- 日期：2026-07-12
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
当前业务代码中的按钮大量使用 `styled.button` 自定义样式，与 `@wuh.site/components/button` 组件存在风格不一致、维护成本高的问题。同时需要确认业务代码中的图标已全部切换到 `@wuh.site/components/icons` 组件库。

## 引用规范
- `specs/component-standardization/spec.md`

## 决策
替换策略采用「逐个评估、按需替换」的方式。每个 styled.button 实例独立评估是否可直接替换为 Button 组件，或需要扩展 Button 组件的 API 能力。

```
styled.button 实例 —> 评估复杂度
  |— 简单按钮(icon+click) —> 直接替换为 <Button>
  |— 复杂按钮(自定义布局) —> 用 styled(Button) 扩展
  |— 特殊样式 —> 保留自定义样式但使用 Button 基组件
```

| 维度 | 选择 | 理由 |
|------|------|------|
| 按钮组件 | @wuh.site/components/button | 已有完整的 variant/color/size props 体系 |
| 图标组件 | @wuh.site/components/icons | 已有 30+ 图标，支持 lucide-react 和自定义品牌图标 |
| 样式 | styled-components + transient props | 与项目现有样式方案一致 |

## 任务
### Phase 1: Button 替换 — 简单按钮
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-floating.ts`
- [ ] 删除 `FloatingButton`、`LikeButton` 的 `styled.button` 定义
- [ ] **文件:** `packages/wuh.site.next/app/post/components/FloatingActions.tsx`
- [ ] 导入 `Button` from `@wuh.site/components/button`
- [ ] 将 `FloatingButton` 替换为 `<Button variant="outlined" color="secondary" size="small">`
- [ ] 将 `LikeButton` 替换为 `<Button variant="outlined" color="primary" size="small">` + `icon={<IconThumbUp />}`
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 删除 `MobileToggle`、`ThemeToggle`、`MobileActionButton` 的 `styled.button` 定义
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`
- [ ] 导入 `Button` from `@wuh.site/components/button`
- [ ] 替换三个按钮为 Button 组件
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.next/app/design/system-color/page.tsx`
- [ ] 删除 `ThemeChip` 的 `styled.button` 定义
- [ ] 导入 `Button` from `@wuh.site/components/button`
- [ ] 替换为 Button 组件，用 variant 切换表达 active 状态
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [ ] 删除 `ComposerSend`、`ComposerBadge` 的 `styled.button` 定义
- [ ] **文件:** `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- [ ] 导入 `Button` from `@wuh.site/components/button`
- [ ] 替换 ComposerSend 和 ComposerBadge 为 Button 组件
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误
### Phase 2: Button 替换 — 复杂按钮
- [ ] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [ ] 将 `GuestbookTrigger` 的 `styled.button` 改为 `styled(Button)` 扩展，保留自定义布局
- [ ] **文件:** `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- [ ] 更新 `GuestbookTrigger` 的使用方式
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.next/app/components/ContactCard.tsx`
- [ ] 评估是否可将 ActionArea 替换为 Button（因其支持 as prop 和 href）
- [ ] 如可用 Button 替换则替换，否则使用 styled(Button) 扩展
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.next/app/about/styles.ts`
- [ ] 查看 GuestbookSubmit 的 `styled.button` 定义
- [ ] 替换为 Button 组件或 styled(Button) 扩展
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误
### Phase 3: 验证与收尾
- [ ] 确认 `packages/wuh.site.next/` 中无 `<svg` 标签
- [ ] 如有发现，替换为对应的 `@wuh.site/components/icons` 组件
- [ ] **验证:** `rg -F '<svg' -g '*.tsx' packages/wuh.site.next/` 返回空
- [ ] `pnpm exec tsc --noEmit` 零错误
- [ ] `pnpm build:next` 构建成功
- [ ] 提交前做视觉对比检查
- [ ] 所有 `styled.button` 在业务代码中被替换为 Button 组件或 styled(Button) 扩展
- [ ] 业务代码无内联 SVG
- [ ] `npx tsc --noEmit` 零错误
- [ ] `pnpm build:next` 成功
### Phase 4: Image 替换
- [ ] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`
- [ ] 导入 `Image` from `@wuh.site/components/image`
- [ ] 替换 `<img src={avatarUrl} ... />` 为 `<Image src={avatarUrl} ... />`
- [ ] 保留 borderRadius、width/height 等样式
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误
- [ ] **文件:** `packages/wuh.site.next/app/post/components/PostCover.tsx`
- [ ] 导入 `Image` from `@wuh.site/components/image`
- [ ] 替换 `<img src={src} ... />` 为 `<Image src={src} ... />`，移除手动 onError 处理
- [ ] `CoverImage` wrapper 保留
- [ ] **验证:** `pnpm exec tsc --noEmit` 零错误

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-12-P-component-standardization
date: 2026-07-12
type: P
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/203

domain:
  name: 组件标准化
  keywords:
    - 按钮
    - 图标
    - 图片
    - button
    - icon
    - image
    - img
    - 代码优化
    - component
    - 复用
    - styled-button
    - 前端页面
    - 交互元素
  description: 将业务代码中的自定义 styled.button 替换为 @wuh.site/components/button 组件，原生 <img> 替换为 @wuh.site/components/image，确认业务代码图标已使用 @wuh.site/components/icons
```

### `design.md`
# 设计文档

## 架构

替换策略采用「逐个评估、按需替换」的方式。每个 styled.button 实例独立评估是否可直接替换为 Button 组件，或需要扩展 Button 组件的 API 能力。

```
styled.button 实例 —> 评估复杂度
  |— 简单按钮(icon+click) —> 直接替换为 <Button>
  |— 复杂按钮(自定义布局) —> 用 styled(Button) 扩展
  |— 特殊样式 —> 保留自定义样式但使用 Button 基组件
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 按钮组件 | @wuh.site/components/button | 已有完整的 variant/color/size props 体系 |
| 图标组件 | @wuh.site/components/icons | 已有 30+ 图标，支持 lucide-react 和自定义品牌图标 |
| 样式 | styled-components + transient props | 与项目现有样式方案一致 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| Button | @wuh.site/components/button | 复用 | 项目已有使用 |
| Icon* | @wuh.site/components/icons | 复用（已在使用） | 项目广泛使用 |
| Image | @wuh.site/components/image | 复用 | PostCover, AboutView |
## 组件/模块设计

### FloatingButton (post-floating.ts)

- 当前: 40x40 圆形，带 `styled.button` pulse 动画
- 替换: `<Button variant="outlined" color="secondary" size="small">` + icon prop
- 特殊: pulse 动画通过 `icon` slot 或 children 实现

### LikeButton (post-floating.ts)

- 当前: 扩展 FloatingButton，带 heartBeat 动画和点赞颜色
- 替换: `<Button variant="outlined" color="primary" size="small">` + icon + children

### GuestbookTrigger (guestbook-barrage.styles.ts)

- 当前: grid 布局，3 列，带渐变背景
- 替换: 使用 styled(Button) 扩展，保留自定义 grid 布局

### ComposerSend (guestbook-barrage.styles.ts)

- 当前: 40x40 圆形发送按钮
- 替换: `<Button variant="filled" color="primary" size="small" icon={<IconArrowRight />} />`

### ComposerBadge (guestbook-barrage.styles.ts)

- 当前: 昵称头像显示按钮
- 替换: `<Button variant="text" color="secondary" size="small" />`

### ThemeChip (system-color/page.tsx)

- 当前: 主题选择 chip
- 替换: `<Button variant="outlined" color="primary" size="small" />`，保持 `$active` 状态驱动 variant 切换

### ThemeToggle (SiteHeader/styles)

- 当前: 主题切换按钮
- 替换: `<Button variant="outlined" color="primary" size="small" />` + icon

### MobileToggle (SiteHeader/styles)

- 当前: 汉堡菜单按钮
- 替换: `<Button variant="outlined" color="secondary" size="small" />` + icon

### MobileActionButton (SiteHeader/styles)

- 当前: 移动端操作按钮
- 替换: `<Button variant="outlined" color="secondary" size="small" />`

### ActionArea (ContactCard.tsx)

- 当前: 200x200 方块，撑满二维码或链接图标，同时支持 `as` prop 切换 a/button
- 替换: 复杂场景，保留 styled 但使用 Button sizes/tokens，或保持独立

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无（行为不变，仅替换实现）
- **向后兼容:** 完全兼容
- **性能影响:** 无

### PostCover (post/components/PostCover.tsx)

- 当前: 自定义 img 组件，手动管理 onError 隐藏
- 替换: 直接使用 `@wuh.site/components/image`，自带 error fallback / skeleton
- `CoverImage` styled wrapper 保留

### AboutView GitHub avatar

- 当前: `<img src={avatarUrl} ... />`
- 替换: `<Image src={avatarUrl} alt={name} width={56} height={56} borderRadius="50%" />`

### `proposal.md`
# 组件标准化

## 背景

当前业务代码中的按钮大量使用 `styled.button` 自定义样式，与 `@wuh.site/components/button` 组件存在风格不一致、维护成本高的问题。同时需要确认业务代码中的图标已全部切换到 `@wuh.site/components/icons` 组件库。

## 目标

- 将业务代码中的 `styled.button` 替换为 `@wuh.site/components/button` 组件
- 将业务代码中的原生 `<img>` 替换为 `@wuh.site/components/image` 组件
- 确认并通过代码审查保证所有业务代码已使用 `@wuh.site/components/icons` 图标组件
- 按钮组件统一使用瞬态 props 和共享样式 Token

## 非目标（明确不做）

- 不修改 `packages/components/` 内部的组件实现（属于共享库本身）
- 不涉及按钮的视觉重设计，仅替换技术实现
- 不调整后端代码
- `share-utils.ts` 中的 `<img>` 属于 HTML 模板字面量，非 React 渲染树，不替换

## 影响范围

- `packages/wuh.site.next/app/post/styles/post-floating.ts` — 替换 FloatingButton、LikeButton
- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 替换 MobileToggle、ThemeToggle、MobileActionButton
- `packages/wuh.site.next/app/components/ContactCard.tsx` — 替换 ActionArea
- `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts` — 替换 GuestbookTrigger、ComposerSend、ComposerBadge
- `packages/wuh.site.next/app/about/styles.ts` — 替换 GuestbookSubmit
- `packages/wuh.site.next/app/design/system-color/page.tsx` — 替换 ThemeChip
- `packages/wuh.site.next/app/about/AboutView.tsx` — 替换 GitHub 头像的 `<img>`
- `packages/wuh.site.next/app/post/components/PostCover.tsx` — 替换博文封面的 `<img>`

### `specs/component-standardization/spec.md`
# Spec: 组件标准化

## ADDED

### Requirement: Button 组件统一

- **GIVEN** 业务代码中的按钮区域
- **WHEN** 用户交互触发按钮功能
- **THEN** 按钮使用 `@wuh.site/components/button` 组件渲染
- **AND** 按钮样式与设计系统的 Theme Token 一致

### Requirement: 图标组件统一

- **GIVEN** 业务代码需要显示图标
- **WHEN** 图标渲染到页面
- **THEN** 使用 `@wuh.site/components/icons` 导出的图标组件
- **AND** 业务代码中不存在内联 `<svg>` 标签

### Requirement: Image 组件统一

- **GIVEN** 业务代码需要展示图片
- **WHEN** 图片渲染到页面
- **THEN** 使用 `@wuh.site/components/image` 组件
- **AND** 业务代码中不存在原生 `<img>` 标签（HTML 模板字面量除外）

## REMOVED

### Requirement: 移除 business code 中的 `styled.button`

- **GIVEN** 业务代码文件
- **WHEN** 通过代码审查和搜索确认
- **THEN** 自定义 `styled.button` 不再存在于业务代码
- **AND** 所有按钮功能通过共享 Button 组件实现

### `tasks.md`
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
