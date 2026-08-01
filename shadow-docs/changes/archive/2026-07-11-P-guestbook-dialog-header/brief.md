# 留言板 Dialog 头部优化

> 原始变更名：`2026-07-11-P-guestbook-dialog-header`

## 元数据
- 日期：2026-07-11
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
当前留言板 Dialog 的 header 只有纯标题 "留言板"，缺少氛围和引导。trigger 按钮中已有副标题和提示文案，但这些信息在打开 Dialog 后就消失了。同时 sampleMessages 中的群聊模式提示放在消息流里，容易跟真实留言混淆。

## 引用规范
- `specs/guestbook-barrage/spec.md`

## 决策
当前 Dialog header 渲染结构：

```
DialogHeader (flex row, align-items: center, justify-content: space-between)
├── DialogTitle (h3) ← title prop
└── CloseButton
```

改后：

```
DialogHeader (flex row, align-items: flex-start, justify-content: space-between)
├── DialogHeaderContent (flex column)
│   ├── DialogTitle (h3) ← title prop
│   └── DialogSubtitle (p) ← subtitle prop (新增)
└── CloseButton
```

| 维度 | 选择 | 理由 |
|------|------|------|
| subtitle 类型 | `ReactNode` | 与 title 一致，灵活支持文本/富文本 |
| 样式实现 | styled-components | 与现有 Dialog 样式体系一致 |
| DialogHeader 对齐 | `flex-start` | 适配 subtitle 多行时 close button 顶部对齐 |

## 任务
### Phase 1: Dialog 组件增强
- [ ] **文件:** `packages/components/dialog/styles/index.tsx`
- [ ] 在 styles 中新增 `DialogHeaderContent` 组件（flex column 容器）
- [ ] 在 styles 中新增 `DialogSubtitle` 组件（p 标签，小字 muted 色）
- [ ] 导出新组件
- [ ] **验证:** `npx tsc --noEmit` 零错误
- [ ] **文件:** `packages/components/dialog/index.tsx`
- [ ] `DialogProps` 新增可选 `subtitle?: React.ReactNode`
- [ ] 渲染逻辑：title 存在时，DialogHeader → DialogHeaderContent(DialogTitle + DialogSubtitle) + CloseButton
- [ ] DialogHeader 改为 `align-items: flex-start` 以适配 subtitle 多行场景
- [ ] **验证:** `npx tsc --noEmit` 零错误
### Phase 2: 留言板接入
- [ ] **文件:** `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- [ ] Dialog 调用传入 `subtitle="声无哀乐"`
- [ ] Dialog body 顶部新增引导短语：`"萍水楚客，路远情长"`
- [ ] 移除 sampleMessages 第 2 条（群聊模式提示），或保留不展示为正式消息
- [ ] **验证:** `npx tsc --noEmit` 零错误，`pnpm build:next` 构建通过
### Phase 3: 规范同步
- [ ] **文件:** `openspec/specs/guestbook-barrage/spec.md`
- [ ] 在 spec.md 末尾添加 ## MODIFIED: 留言板 Dialog 头部优化
- [ ] GIVEN/WHEN/THEN 描述 header 有 subtitle 的行为
- [ ] **文件:** `openspec/INDEX.md`
- [ ] 无需新增领域，guestbook-barrage 已有
- [ ] Dialog 不传 subtitle 时行为完全不变
- [ ] 传 subtitle 时 header 展示 title + subtitle 垂直排列
- [ ] 留言板打开后 header 显示 "留言板" + "声无哀乐"
- [ ] Dialog body 顶部显示 "萍水楚客，路远情长"
- [ ] `npx tsc --noEmit` 零错误

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: guestbook-dialog-header
date: 2026-07-11
type: P
status: archived
issue: https://github.com/stack-wuh/x.wuh.site/issues/196

domain:
  name: 留言板 Dialog 头部优化
  keywords:
    - guestbook
    - dialog
    - header
    - title
    - subtitle
    - description
    - 留言板
    - 弹窗
    - 头部
    - 标题
    - 副标题
    - 引导
    - 提示
    - 文案
    - 对话框
```

### `design.md`
# 设计文档

## 架构

当前 Dialog header 渲染结构：

```
DialogHeader (flex row, align-items: center, justify-content: space-between)
├── DialogTitle (h3) ← title prop
└── CloseButton
```

改后：

```
DialogHeader (flex row, align-items: flex-start, justify-content: space-between)
├── DialogHeaderContent (flex column)
│   ├── DialogTitle (h3) ← title prop
│   └── DialogSubtitle (p) ← subtitle prop (新增)
└── CloseButton
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| subtitle 类型 | `ReactNode` | 与 title 一致，灵活支持文本/富文本 |
| 样式实现 | styled-components | 与现有 Dialog 样式体系一致 |
| DialogHeader 对齐 | `flex-start` | 适配 subtitle 多行时 close button 顶部对齐 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| Dialog | @wuh.site/components/dialog | 扩展（新增 subtitle prop） | wuh.site/demo-dialog-confirm |

## 组件/模块设计

### Dialog 组件

新增 props:

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `subtitle` | `ReactNode` | 无 | 标题下方副文本，小字 muted 颜色 |

新增样式组件 `DialogSubtitle`:

```tsx
export const DialogSubtitle = styled.p`
  margin: 0;
  font-size: var(--font-size-sm, 14px);
  color: var(--text-muted);
  font-weight: 400;
  line-height: 1.5;
`
```

### GuestbookBarrageDialog

- title: `"留言板"`
- subtitle: `"声无哀乐"`
- DialogBody 顶部新增引导短语: `"萍水楚客，路远情长"`

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无（subtitle 为可选 prop）
- **向后兼容:** 兼容，不传 subtitle 时表现与原来完全一致
- **性能影响:** 无

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 640px | header title + subtitle 垂直排列 |
| < 640px | header 内边距自动缩小 |

### `proposal.md`
# 留言板 Dialog 头部优化

## 背景

当前留言板 Dialog 的 header 只有纯标题 "留言板"，缺少氛围和引导。trigger 按钮中已有副标题和提示文案，但这些信息在打开 Dialog 后就消失了。同时 sampleMessages 中的群聊模式提示放在消息流里，容易跟真实留言混淆。

## 目标

- Dialog header 新增 subtitle 区域，展示装饰性短语营造氛围
- Dialog body 顶部新增引导提示文字，替代 sample 消息的功能
- trigger 文案已由用户优化为更贴合氛围的表达
- Dialog 组件新增 `subtitle` prop，支持 header 中标题下方展示副文本

## 非目标

- 不改变留言板整体交互逻辑
- 不改变消息发送/展示流程
- 不涉及后端 API 变更

## 影响范围

- `packages/components/dialog/index.tsx` — 新增 `subtitle` prop
- `packages/components/dialog/styles/*.tsx` — 新增 `DialogSubtitle` 样式组件
- `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx` — 应用 subtitle，调整引导文案

### `specs/guestbook-barrage/spec.md`
# 留言板群聊弹窗

## MODIFIED: 留言板 Dialog 头部优化

### Requirement: Dialog Header 展示 subtitle

#### Scenario: 用户打开留言弹窗
- **GIVEN** 用户打开留言板弹窗
- **WHEN** Dialog 渲染完成
- **THEN** header 应展示标题 "留言板"
- **AND** header 标题下方应展示副文本 "声无哀乐"
- **AND** 副文本应使用小字号和 muted 颜色

### Requirement: Dialog Body 顶部引导短语

#### Scenario: 用户打开留言弹窗
- **GIVEN** 用户打开留言板弹窗
- **WHEN** DialogBody 渲染完成
- **THEN** 消息流上方应展示引导短语 "萍水楚客，路远情长"
- **AND** 引导短语不应与真实留言混淆（不同气泡样式或位置）

### Requirement: subtitle 向后兼容

#### Scenario: Dialog 未传 subtitle
- **GIVEN** 其他页面调用 Dialog 组件
- **WHEN** 未传入 subtitle prop
- **THEN** header 仅渲染标题，行为完全不变
- **AND** 不渲染额外 DOM 节点

### `tasks.md`
# 任务清单

## Phase 1: Dialog 组件增强

### Task 1: 新增 DialogSubtitle 样式组件

- [ ] **文件:** `packages/components/dialog/styles/index.tsx`
- [ ] 在 styles 中新增 `DialogHeaderContent` 组件（flex column 容器）
- [ ] 在 styles 中新增 `DialogSubtitle` 组件（p 标签，小字 muted 色）
- [ ] 导出新组件
- [ ] **验证:** `npx tsc --noEmit` 零错误

### Task 2: Dialog 组件支持 subtitle prop

- [ ] **文件:** `packages/components/dialog/index.tsx`
- [ ] `DialogProps` 新增可选 `subtitle?: React.ReactNode`
- [ ] 渲染逻辑：title 存在时，DialogHeader → DialogHeaderContent(DialogTitle + DialogSubtitle) + CloseButton
- [ ] DialogHeader 改为 `align-items: flex-start` 以适配 subtitle 多行场景
- [ ] **验证:** `npx tsc --noEmit` 零错误

## Phase 2: 留言板接入

### Task 3: GuestbookBarrageDialog 应用 subtitle 和引导文案

- [ ] **文件:** `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- [ ] Dialog 调用传入 `subtitle="声无哀乐"`
- [ ] Dialog body 顶部新增引导短语：`"萍水楚客，路远情长"`
- [ ] 移除 sampleMessages 第 2 条（群聊模式提示），或保留不展示为正式消息
- [ ] **验证:** `npx tsc --noEmit` 零错误，`pnpm build:next` 构建通过

## Phase 3: 规范同步

### Task 4: 更新 guestbook-barrage spec

- [ ] **文件:** `openspec/specs/guestbook-barrage/spec.md`
- [ ] 在 spec.md 末尾添加 ## MODIFIED: 留言板 Dialog 头部优化
- [ ] GIVEN/WHEN/THEN 描述 header 有 subtitle 的行为

### Task 5: 更新 INDEX

- [ ] **文件:** `openspec/INDEX.md`
- [ ] 无需新增领域，guestbook-barrage 已有

## 验收

- [ ] Dialog 不传 subtitle 时行为完全不变
- [ ] 传 subtitle 时 header 展示 title + subtitle 垂直排列
- [ ] 留言板打开后 header 显示 "留言板" + "声无哀乐"
- [ ] Dialog body 顶部显示 "萍水楚客，路远情长"
- [ ] `npx tsc --noEmit` 零错误
