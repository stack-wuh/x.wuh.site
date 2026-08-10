# 留言板输入区改为 Telegram 风格浮动条

> 原始变更名：`2026-07-11-P-guestbook-floating-input`

## 元数据
- 日期：2026-07-11
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
About 页面留言板弹窗底部输入区存在以下问题：

1. 输入区布局占两行（昵称单独一行 + 内容输入一行），不够紧凑
2. 输入框采用独立卡片式背景，与聊天面板视觉割裂
3. 输入框和发送按钮未整合为整体，操作效率低
4. 昵称编辑入口在输入区外，改昵称不直观

## 引用规范
- `specs/guestbook-floating-input/spec.md`

## 决策
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

| 维度 | 选择 | 理由 |
|------|------|------|
| 输入条定位 | 负 margin + positive z-index | 轻量、不破坏 DOM 流，不影响 Dialog 滚动逻辑 |
| 发送按钮 | 圆形主题色按钮 | TG 风格，视觉焦点集中 |
| 昵称编辑 | 徽标点击切换为内联 input | 不额外占用布局空间 |
| 暗色 | `[data-color-scheme="dark"] &` 变量 | 与站点主题体系一致 |
| 毛玻璃效果 | backdrop-filter: blur(16px) | 增强悬浮层次感 |

## 任务
### Phase 1: 布局改造
- [x] **文件:** `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- [x] 移除 `GuestbookBody` / `GuestbookPanel` 容器
- [x] 引入 `ComposerBadge` / `ComposerNicknameInput` 组件
- [x] 添加 `editingNickname` 状态切换昵称编辑
- [x] 添加 `Enter 发送` 键盘事件
- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 重写 Composer：flex 水平布局、负 margin 浮动、backdrop-filter 毛玻璃、z-index
- [x] 新增 ComposerBadge（首字母徽标按钮）
- [x] 新增 ComposerNicknameInput（内联昵称编辑输入框）
- [x] 重写 ComposerSend（圆形主题色按钮）
- [x] 调整 ChatFeed 底部 padding 80px 避免被浮动条遮挡
- [x] GuestbookStage 底部圆角收窄（16px 16px 12px 12px）
- [x] **验证:** `packages/wuh.site.next/node_modules/.bin/oxlint` 零错误
### Phase 2: 样式收敛和暗色模式
- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] Composer 暗色背景和阴影使用 `[data-color-scheme="dark"]`
- [x] 浮动条 focus-within 边框变色
- [x] **验证:** 暗色/亮色切换样式正确
- [x] oxlint 零错误
- [x] 单元测试 4/4 通过
- [x] Enter 发送消息
- [x] 昵称徽标点击编辑
- [x] 暗色/亮色主题视图一致

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-11-P-guestbook-floating-input
date: 2026-07-11
type: P
status: archived
issue: https://github.com/stack-wuh/x.wuh.site/issues/194
```

### `design.md`
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

### `proposal.md`
# 留言板输入区改为 Telegram 风格浮动条

## 背景

About 页面留言板弹窗底部输入区存在以下问题：

1. 输入区布局占两行（昵称单独一行 + 内容输入一行），不够紧凑
2. 输入框采用独立卡片式背景，与聊天面板视觉割裂
3. 输入框和发送按钮未整合为整体，操作效率低
4. 昵称编辑入口在输入区外，改昵称不直观

## 目标

- 输入区改为单行浮动条，margin 负值重叠聊天面板底部
- 发送按钮改为圆形图标按钮，嵌入浮动条最右侧
- 昵称以首字母徽标形式展示在浮动条左侧，点击切换为内联编辑
- 暗色模式跟随站点 `data-color-scheme`

## 非目标（明确不做）

- 不修改留言板后端接口和数据模型
- 不影响弹窗 trigger 样式
- 不涉及语言国际化

## 影响范围

- `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx` — 移除 GuestbookBody/Panel 包装层，新增编辑昵称状态和徽标组件
- `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts` — 重写 Composer 全部样式，新增浮动条、圆按钮、昵称徽标组件

### `specs/guestbook-floating-input/spec.md`
# Spec: 留言板浮动输入条

## ADDED

### Requirement: 浮动输入条布局
- **GIVEN** 用户打开留言板弹窗
- **WHEN** 输入区渲染
- **THEN** 输入条应通过负 margin 重叠聊天面板底部，产生悬浮效果
- **AND** 输入条有 backdrop-filter 毛玻璃和 box-shadow 阴影

### Requirement: 单行文本输入
- **GIVEN** 留言板输入区
- **WHEN** 用户在输入框中输入文本
- **THEN** 输入框应撑满除按钮外的剩余宽度
- **AND** 输入框透明无边框

### Requirement: Enter 发送
- **GIVEN** 用户在留言板输入区输入文本
- **WHEN** 用户按下 Enter（不按 Shift）
- **THEN** 应触发表单提交发送消息

### Requirement: 圆形发送按钮
- **GIVEN** 留言板输入区
- **WHEN** 渲染发送按钮
- **THEN** 按钮应为 40x40 圆形，填充主题色 `var(--primary-color)`
- **AND** 按钮内置箭头图标
- **AND** 按钮不可用时 opacity 0.3

### Requirement: 昵称徽标编辑
- **GIVEN** 用户已设置昵称
- **WHEN** 浮动条左侧展示昵称首字母徽标
- **AND** 用户点击徽标
- **THEN** 输入框切换为昵称编辑模式
- **AND** Enter 或失焦退出编辑模式

### Requirement: 暗色模式同步
- **GIVEN** 站点处于暗色模式（`[data-color-scheme="dark"]`）
- **WHEN** 浮动输入条渲染
- **THEN** 背景和阴影应与亮色模式不同，使用站点暗色主题变量

### `tasks.md`
# 任务清单

## Phase 1: 布局改造

### Task 1: 移除多余包装层 + 重写 Composer 样式

- [x] **文件:** `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- [x] 移除 `GuestbookBody` / `GuestbookPanel` 容器
- [x] 引入 `ComposerBadge` / `ComposerNicknameInput` 组件
- [x] 添加 `editingNickname` 状态切换昵称编辑
- [x] 添加 `Enter 发送` 键盘事件
- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 重写 Composer：flex 水平布局、负 margin 浮动、backdrop-filter 毛玻璃、z-index
- [x] 新增 ComposerBadge（首字母徽标按钮）
- [x] 新增 ComposerNicknameInput（内联昵称编辑输入框）
- [x] 重写 ComposerSend（圆形主题色按钮）
- [x] 调整 ChatFeed 底部 padding 80px 避免被浮动条遮挡
- [x] GuestbookStage 底部圆角收窄（16px 16px 12px 12px）
- [x] **验证:** `packages/wuh.site.next/node_modules/.bin/oxlint` 零错误

## Phase 2: 样式收敛和暗色模式

### Task 2: 暗色变量集成

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] Composer 暗色背景和阴影使用 `[data-color-scheme="dark"]`
- [x] 浮动条 focus-within 边框变色
- [x] **验证:** 暗色/亮色切换样式正确

## 验收

- [x] oxlint 零错误
- [x] 单元测试 4/4 通过
- [x] Enter 发送消息
- [x] 昵称徽标点击编辑
- [x] 暗色/亮色主题视图一致
