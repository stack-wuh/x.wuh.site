# 设计文档

## 架构

```
Dialog
 └── GuestbookWrapper
      ├── GuestbookStage (聊天区域)
      │    └── ChatFeed (消息列表，底部 padding 80px 防止被浮动条遮挡)
      │
      ├── Composer (浮动输入条, margin: -22px 8px 8px)
      │    ├── ComposerBadge (左侧昵称首字母徽标, 点击切换编辑模式)
      │    ├── ComposerInput (单行文本输入, Enter 发送)
      │    └── ComposerSend (右侧圆形发送按钮, 主题色填充)
      │
      └── 失败提示行 (failedCount > 0 时显示)
```

浮动输入条通过负 margin 实现「重叠在聊天区域底部」的视觉悬浮效果。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 输入条定位 | 负 margin + positive z-index | 轻量、不破坏 DOM 流，不影响 Dialog 滚动逻辑 |
| 发送按钮 | 圆形主题色按钮 | TG 风格，视觉焦点集中 |
| 昵称编辑 | 徽标点击切换为内联 input | 不额外占用布局空间 |
| 暗色 | `[data-color-scheme="dark"] &` 变量 | 与站点主题体系一致 |
| 毛玻璃效果 | backdrop-filter: blur(16px) | 增强悬浮层次感 |

## 组件/模块设计

### GuestbookWrapper

移除 `GuestbookBody` 和 `GuestbookPanel` 两层包装，结构扁平化为一层：`GuestbookStage` + `Composer`。

### Composer（浮动输入条）

- `position: relative`，不设 `flex` 方向，使用 flex 水平排列子元素
- `margin: -22px 8px 8px` 产生重叠感
- `backdrop-filter: blur(16px)` + `box-shadow` 制造毛玻璃悬浮效果
- `z-index: 2` 确保在聊天面板之上
- `&:focus-within` 边框变色表示聚焦状态

### ComposerBadge（昵称徽标）

- 32px 圆角方钮，显示昵称首字母
- 点击调用 `setEditingNickname` 切换状态
- 处于编辑模式时显示 `ComposerNicknameInput`，输入 Enter/Blur 退出编辑

### ComposerInput（单行输入）

- 无边框、透明背景、`flex: 1` 撑满宽度
- `placeholder` 动态显示 `作为 {nickname}，说点什么...`
- `Enter` 触发 `requestSubmit()`

### ComposerSend（发送按钮）

- 40x40 圆形按钮，填充主题色 `var(--primary-color)`
- 内置箭头图标 `IconArrowRight`
- disabled 时 opacity 0.3
- hover / active 分别有 scale 放大/缩小动画

## 响应式策略

| 断点 | 行为 |
|------|------|
| 所有屏幕 | 单行输入条不换行，输入框自动撑满 |
| <= 640px | ChatFeed padding 底部从 80px 调整为 76px |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无（降级显示：旧版用户看到的是 `ComposerForm` 渲染为 flex 条，不会报错）
- **向后兼容:** 完全兼容，样式层改动
- **性能影响:** 无
