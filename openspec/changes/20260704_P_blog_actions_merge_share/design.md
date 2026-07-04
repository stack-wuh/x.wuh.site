# 设计文档

## 架构

将操作按钮（返回首页、回到顶部、点赞）整合到 ShareInfoCard 内部，与分享按钮共享同一个卡片容器。

```
ShareInfoCard
├── ActionButtons (上方，操作按钮区)
│   ├── 返回首页
│   ├── 回到顶部
│   └── 点赞
├── Divider (分隔线)
└── SharedLinkGroup (下方，分享按钮区)
    ├── 微信
    ├── QQ
    ├── 微博
    ├── Twitter
    ├── Email
    └── 复制链接
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 布局方案 | Flexbox 纵向布局 | 简单直接，易于维护 |
| 按钮样式 | 复用 SharedLinkGroup 按钮风格 | 保持视觉一致性 |
| 组件结构 | 重构 FloatingActions 为 ActionButtons | 保留行为逻辑，调整渲染结构 |

## 组件/模块设计

### ActionButtons

重构后的操作按钮组件，放置在分享卡片内部。

**Props:**
- 无需 props，内部硬编码三个操作

**样式:**
- 横向排列，圆形图标按钮
- 与 SharedLinkGroup 按钮样式一致
- 桌面端：flex-direction: row，居中对齐
- 移动端：自动换行或纵向堆叠

### ShareInfoCard 内部布局

调整 ShareCardInner 样式：
- 添加 ActionButtons 和 SharedLinkGroup 之间的分隔线
- 控制两个区域的间距
- 确保移动端正确堆叠

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 640px | 操作按钮横向排列，分享按钮横向排列，上下两行 |
| < 640px | 操作按钮自动换行或纵向堆叠，分享按钮纵向堆叠 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 完全兼容，只是 UI 布局调整
- **性能影响:** 无，减少了一个独立卡片的 DOM 节点
