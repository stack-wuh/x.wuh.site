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
