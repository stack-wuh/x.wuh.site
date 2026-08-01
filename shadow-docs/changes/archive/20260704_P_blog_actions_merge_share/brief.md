# 博客详情页操作按钮融入分享区

> 原始变更名：`20260704_P_blog_actions_merge_share`

## 元数据
- 日期：2026-07-04
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
当前博客详情页底部工具栏存在以下问题：
- 独立卡片的边框视觉过重
- 按钮样式与整体设计不协调
- 文字+图标的组合不够优雅
- 位置安排感觉别扭，作为独立区域突兀

用户希望将操作按钮（返回首页、回到顶部、点赞）整合到现有的分享卡片中，形成统一的操作区域。

## 引用规范
- `specs/blog-actions/spec.md`

## 决策
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

| 维度 | 选择 | 理由 |
|------|------|------|
| 布局方案 | Flexbox 纵向布局 | 简单直接，易于维护 |
| 按钮样式 | 复用 SharedLinkGroup 按钮风格 | 保持视觉一致性 |
| 组件结构 | 重构 FloatingActions 为 ActionButtons | 保留行为逻辑，调整渲染结构 |

## 任务
### Phase 1: 重构操作按钮组件
- [ ] **文件:** `packages/wuh.site.next/app/post/components/FloatingActions.tsx`
- [ ] 重命名为 `ActionButtons.tsx` 或直接在原文件中调整
- [ ] 调整按钮样式，参考 SharedLinkGroup 的圆形图标按钮
- [ ] 移除文字标签，改为纯图标+tooltip
- [ ] 横向排列，gap 间距与分享按钮一致
- [ ] **验证:** 组件渲染正常，样式符合设计
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-floating.ts`
- [ ] 删除独立卡片样式（边框、背景、padding）
- [ ] 改为简单的 flex 容器，横向排列
- [ ] 按钮样式参考 SharedLinkGroup 的 SShareButton
- [ ] 响应式：移动端自动换行
- [ ] **验证:** 样式符合设计稿
### Phase 2: 整合到分享卡片
- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [ ] 移除 RedundantInfoCard 和 ShareInfoCard 之间的 `<FloatingActions />`
- [ ] 在 ShareInfoCard 内部添加 ActionButtons 组件
- [ ] 调整 ShareCardInner 结构：ActionButtons 在上，分隔线，SharedLinkGroup 在下
- [ ] **验证:** 页面渲染正常，布局符合预期
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-article.ts`
- [ ] 在 ShareCardInner 中添加分隔线样式
- [ ] 控制 ActionButtons 和 SharedLinkGroup 之间的间距
- [ ] 确保移动端正确堆叠
- [ ] **验证:** 分隔线显示正确，间距合理
### Phase 3: 清理与验证
- [ ] 检查 `post-floating.ts` 是否还有其他地方引用
- [ ] 如无引用，删除或保留最小必要样式
- [ ] 删除 PostView 中不再使用的 import
- [ ] **验证:** 无编译错误
- [ ] 桌面端预览：操作按钮和分享按钮分两行显示
- [ ] 移动端预览：按钮正确堆叠，无挤压溢出
- [ ] 交互验证：返回首页、回到顶部、点赞功能正常
- [ ] **验证:** 所有断点下布局和交互正常
- [ ] 操作按钮成功融入分享卡片
- [ ] 桌面端分两行显示，移动端堆叠
- [ ] 按钮样式与分享按钮一致
- [ ] 所有功能（返回首页、回到顶部、点赞）正常工作
- [ ] 无 ESLint 错误
- [ ] `pnpm tsc --noEmit` 零错误

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: blog_actions_merge_share
date: 2026-07-04
type: P
status: archived
issue: https://github.com/stack-wuh/x.wuh.site/issues/173
```

### `design.md`
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

### `proposal.md`
# 博客详情页操作按钮融入分享区

## 背景

当前博客详情页底部工具栏存在以下问题：
- 独立卡片的边框视觉过重
- 按钮样式与整体设计不协调
- 文字+图标的组合不够优雅
- 位置安排感觉别扭，作为独立区域突兀

用户希望将操作按钮（返回首页、回到顶部、点赞）整合到现有的分享卡片中，形成统一的操作区域。

## 目标

- 移除独立的底部工具栏卡片
- 将三个操作按钮融入分享卡片内部
- 与现有分享按钮保持一致的视觉风格
- 响应式布局：桌面端操作按钮和分享按钮分两行显示，移动端都堆叠排列

## 非目标（明确不做）

- 不修改 PostToolbar（上一篇/下一篇导航）
- 不改变按钮的功能行为
- 不调整分享按钮的样式和交互

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 移除 FloatingActions 调用
- `packages/wuh.site.next/app/post/components/FloatingActions.tsx` — 删除或重构为操作按钮组件
- `packages/wuh.site.next/app/post/styles/post-floating.ts` — 删除或简化样式
- `packages/wuh.site.next/app/post/styles/post-article.ts` — 调整 ShareInfoCard 内部布局

### `specs/blog-actions/spec.md`
# Spec: blog-actions

## MODIFIED

### Requirement: 博客详情页操作按钮布局
- **GIVEN** 用户浏览博客详情页
- **WHEN** 滚动到文章底部分享区
- **THEN** 操作按钮（返回首页、回到顶部、点赞）融入分享卡片内部
- **AND** 操作按钮在上方，分享按钮在下方，中间有分隔线
- **AND** 桌面端两个区域都横向排列
- **AND** 移动端两个区域都纵向堆叠
- **AND** 按钮样式与分享按钮保持一致

### Requirement: 操作按钮交互
- **GIVEN** 用户点击操作按钮
- **WHEN** 点击"返回首页"
- **THEN** 跳转到首页 `/`
- **WHEN** 点击"回到顶部"
- **THEN** 平滑滚动到页面顶部
- **WHEN** 点击"点赞"
- **THEN** 显示提示"点赞功能正在开发中"

## REMOVED

### Requirement: 独立底部工具栏
- 移除独立的底部工具栏卡片，操作按钮已整合到分享区

### `tasks.md`
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
