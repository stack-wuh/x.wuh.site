# 留言弹幕弹窗

> 原始变更名：`20260705_P_message_barrage_dialog`

## 元数据
- 日期：2026-07-05
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
当前文章页底部只有留言占位提示，用户希望把留言区做成更接近 B 站的弹幕式交互：默认以弹幕区域为主，底部提供输入框，点击列表按钮后在同一屏内展开留言列表。这个交互需要同时兼顾桌面端和移动端，并且保留后续与 MongoDB 主库、GitHub 快照同步的扩展空间。

## 引用规范
- `specs/guestbook-barrage/spec.md`

## 决策
# 留言弹幕弹窗设计

## 方案概述

本次变更采用“文章页入口 + Dialog 弹窗 + 弹幕主区 + 列表副区 + 底部输入栏”的组合方案。弹窗默认只显示弹幕主区，列表按钮作为显式开关；桌面端展开后采用左右并列，移动端展开后采用上下布局。整体目标是把留言区从传统表单页升级为更强互动感的弹幕体验，同时控制界面复杂度。

## 方案对比

### 方案 A：抽屉覆盖弹幕区
- **特点:** 点击列表后从右侧覆盖弹幕区域
- **优点:** 实现简单，布局改动少
- **缺点:** 会遮挡弹幕，破坏同屏感，不符合当前需求

### 方案 B：弹窗内左右并列 / 移动端上下布局（推荐）
- **特点:** 列表展开后与弹幕同屏并列，桌面端左右、移动端上下
- **优点:** 保留弹幕主视觉，又能随时查看列表
- **缺点:** 需要额外处理响应式和面板宽度切换

### 方案 C：双视图切换
- **特点:** 弹幕和列表二选一，通过按钮切换整屏视图
- **优点:** 结构最简单，代码量较少
- **缺点:** 不能同屏展示，体验不符合用户期望

**结论:** 选择方案 B。它最符合“弹幕优先、列表辅助”的目标，也最接近用户描述的同屏浏览方式。

## 架构

### 组件边界

```
PostView
└── GuestbookBarrageDialog
    ├── BarrageStage        // 弹幕轨道区域
    ├── GuestbookListPane   // 留言列表区域，默认隐藏
    └── GuestbookComposer   // 底部输入栏
```

- `PostView` 只负责挂载触发入口，不承载业务细节
- `GuestbookBarrageDialog` 负责本次留言 UI 的全部交互状态
- `BarrageStage` 负责弹幕播放、密度控制、空态和加载态
- `GuestbookListPane` 负责列表渲染、滚动和展开/收起
- `GuestbookComposer` 负责输入、100 字限制、发送按钮和列表按钮

### 布局策略

- **桌面端:** Dialog 宽度较大，默认只显示弹幕主区；展开列表后主区收缩到约 2/3，列表占 1/3
- **移动端:** Dialog 采用更窄视口适配；列表展开后转为上下布局，避免左右空间过窄导致弹幕不可读
- **动画:** 面板切换使用短时长过渡，避免弹窗内部跳变过于突兀

## 数据流

### 当前阶段

前端 UI 先以本地状态驱动：

1. 用户在 `PostView` 打开留言弹窗
2. 弹窗默认渲染弹幕主区
3. 用户在底部输入留言，前端限制最多 100 字
4. 用户点击列表按钮，副区展开
5. 桌面端左右并列、移动端上下布局

### 后续联调预留

- 弹幕和列表的数据源最终会接入 `comment` API
- 发送成功后刷新本地列表和弹幕池
- 未来若同步到 MongoDB / GitHub，只影响数据来源，不影响布局组件边界

## 接口设计

### 前端组件 Props

```ts
type GuestbookBarrageDialogProps = {
  open: boolean
  onClose: () => void
  issueNumber?: number
}
```

### 内部状态

```ts
type BarrageMode = 'barrage' | 'split'
type ComposerState = {
  content: string
  showList: boolean
}
```

### 输入限制

- `maxLength = 100`
- 字符统计按输入框当前文本长度计算
- 发送前再次校验，防止程序性绕过限制

## 数据模型

本次前端设计不新增数据库 schema，但需要对齐现有留言字段：

- `nickname`
- `content` / `body`
- `createdAt`
- `status`
- `avatarUrl`

其中弹幕展示优先使用短文本，列表展示完整内容和元信息。

## 影响分析

### 修改范围

- 新增留言弹幕弹窗组件和样式文件
- 在文章页增加打开弹窗的入口
- 后续联调时复用现有留言 API

### 风险点

- 弹幕动画过密时会影响可读性
- 列表展开时若宽度计算不稳，可能在小屏出现挤压
- 输入限制和发送校验若不同步，可能出现前后端长度不一致

### 回滚策略

- 如果 UI 方案不稳定，可先保留弹窗入口，列表区继续隐藏
- 如果弹幕动画影响阅读，可先降到静态列表模式
- 如果输入栏联调失败，可先保留本地 mock，不阻断文章页使用

## 任务
### Phase 1: 弹窗入口与骨架
- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`（新增）
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`（新增）
- [ ] 在文章页增加打开留言弹窗的入口
- [ ] 弹窗默认关闭，点击入口后打开
- [ ] **预计耗时:** 30 分钟
- [ ] **验证:** 本地打开文章页，点击入口可弹出留言窗口
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 使用现有 `Dialog` 作为容器
- [ ] 默认只渲染弹幕主区
- [ ] 预留列表区和底部输入栏位置
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** 弹窗打开后默认只显示弹幕区域
### Phase 2: 弹幕与列表布局
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 弹幕区采用轨道式布局
- [ ] 默认弹幕区占据主要视觉区域
- [ ] 提供空态和示例内容
- [ ] **预计耗时:** 60 分钟
- [ ] **验证:** 弹窗中能看到弹幕内容和轨道层级
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 点击列表按钮后展开列表
- [ ] 桌面端左右并列，弹幕区向左压缩
- [ ] 移动端上下布局，列表从下方展开
- [ ] **预计耗时:** 75 分钟
- [ ] **验证:** 桌面和移动端都能同屏看到弹幕和列表
### Phase 3: 输入栏与限制
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 输入框限制最大 100 字
- [ ] 输入框右侧提供列表按钮和发送按钮
- [ ] 空内容时发送按钮禁用
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** 输入超过 100 字会被截断，按钮状态正确变化
### Phase 4: 数据接入与收口
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.nest/src/modules/comment/comment.controller.ts`
- [ ] **文件:** `packages/wuh.site.nest/src/modules/comment/comment.service.ts`
- [ ] 对齐前端展示字段与后端留言字段
- [ ] 发送成功后刷新弹幕区和列表区
- [ ] 失败时显示 message 提示
- [ ] **预计耗时:** 60 分钟
- [ ] **验证:** 前端可以读取并提交真实留言数据
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] 补齐 focus-visible、disabled、hover 状态
- [ ] 检查桌面端与移动端断点表现
- [ ] 检查空态、加载态、无列表态文案
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** 本地预览无横向溢出，交互状态完整
### Phase 5: 文档与验收
- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/proposal.md`
- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/specs/guestbook-barrage/spec.md`
- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/design.md`
- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/tasks.md`
- [ ] 确认 proposal、spec、design、tasks 内容一致
- [ ] 确认任务粒度在可执行范围内
- [ ] **预计耗时:** 30 分钟
- [ ] **验证:** 文档结构完整，可直接进入 apply

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: message-barrage-dialog
issue: https://github.com/stack-wuh/x.wuh.site/issues/173
date: 2026-07-05
type: P
status: proposed
```

### `design.md`
# 留言弹幕弹窗设计

## 方案概述

本次变更采用“文章页入口 + Dialog 弹窗 + 弹幕主区 + 列表副区 + 底部输入栏”的组合方案。弹窗默认只显示弹幕主区，列表按钮作为显式开关；桌面端展开后采用左右并列，移动端展开后采用上下布局。整体目标是把留言区从传统表单页升级为更强互动感的弹幕体验，同时控制界面复杂度。

## 方案对比

### 方案 A：抽屉覆盖弹幕区
- **特点:** 点击列表后从右侧覆盖弹幕区域
- **优点:** 实现简单，布局改动少
- **缺点:** 会遮挡弹幕，破坏同屏感，不符合当前需求

### 方案 B：弹窗内左右并列 / 移动端上下布局（推荐）
- **特点:** 列表展开后与弹幕同屏并列，桌面端左右、移动端上下
- **优点:** 保留弹幕主视觉，又能随时查看列表
- **缺点:** 需要额外处理响应式和面板宽度切换

### 方案 C：双视图切换
- **特点:** 弹幕和列表二选一，通过按钮切换整屏视图
- **优点:** 结构最简单，代码量较少
- **缺点:** 不能同屏展示，体验不符合用户期望

**结论:** 选择方案 B。它最符合“弹幕优先、列表辅助”的目标，也最接近用户描述的同屏浏览方式。

## 架构

### 组件边界

```
PostView
└── GuestbookBarrageDialog
    ├── BarrageStage        // 弹幕轨道区域
    ├── GuestbookListPane   // 留言列表区域，默认隐藏
    └── GuestbookComposer   // 底部输入栏
```

- `PostView` 只负责挂载触发入口，不承载业务细节
- `GuestbookBarrageDialog` 负责本次留言 UI 的全部交互状态
- `BarrageStage` 负责弹幕播放、密度控制、空态和加载态
- `GuestbookListPane` 负责列表渲染、滚动和展开/收起
- `GuestbookComposer` 负责输入、100 字限制、发送按钮和列表按钮

### 布局策略

- **桌面端:** Dialog 宽度较大，默认只显示弹幕主区；展开列表后主区收缩到约 2/3，列表占 1/3
- **移动端:** Dialog 采用更窄视口适配；列表展开后转为上下布局，避免左右空间过窄导致弹幕不可读
- **动画:** 面板切换使用短时长过渡，避免弹窗内部跳变过于突兀

## 数据流

### 当前阶段

前端 UI 先以本地状态驱动：

1. 用户在 `PostView` 打开留言弹窗
2. 弹窗默认渲染弹幕主区
3. 用户在底部输入留言，前端限制最多 100 字
4. 用户点击列表按钮，副区展开
5. 桌面端左右并列、移动端上下布局

### 后续联调预留

- 弹幕和列表的数据源最终会接入 `comment` API
- 发送成功后刷新本地列表和弹幕池
- 未来若同步到 MongoDB / GitHub，只影响数据来源，不影响布局组件边界

## 接口设计

### 前端组件 Props

```ts
type GuestbookBarrageDialogProps = {
  open: boolean
  onClose: () => void
  issueNumber?: number
}
```

### 内部状态

```ts
type BarrageMode = 'barrage' | 'split'
type ComposerState = {
  content: string
  showList: boolean
}
```

### 输入限制

- `maxLength = 100`
- 字符统计按输入框当前文本长度计算
- 发送前再次校验，防止程序性绕过限制

## 数据模型

本次前端设计不新增数据库 schema，但需要对齐现有留言字段：

- `nickname`
- `content` / `body`
- `createdAt`
- `status`
- `avatarUrl`

其中弹幕展示优先使用短文本，列表展示完整内容和元信息。

## 影响分析

### 修改范围

- 新增留言弹幕弹窗组件和样式文件
- 在文章页增加打开弹窗的入口
- 后续联调时复用现有留言 API

### 风险点

- 弹幕动画过密时会影响可读性
- 列表展开时若宽度计算不稳，可能在小屏出现挤压
- 输入限制和发送校验若不同步，可能出现前后端长度不一致

### 回滚策略

- 如果 UI 方案不稳定，可先保留弹窗入口，列表区继续隐藏
- 如果弹幕动画影响阅读，可先降到静态列表模式
- 如果输入栏联调失败，可先保留本地 mock，不阻断文章页使用

### `proposal.md`
# 留言弹幕弹窗

## 背景

当前文章页底部只有留言占位提示，用户希望把留言区做成更接近 B 站的弹幕式交互：默认以弹幕区域为主，底部提供输入框，点击列表按钮后在同一屏内展开留言列表。这个交互需要同时兼顾桌面端和移动端，并且保留后续与 MongoDB 主库、GitHub 快照同步的扩展空间。

## 目标

- 在文章页提供一个弹窗形式的留言入口
- 弹窗默认展示弹幕区域，列表默认隐藏
- 输入框固定在底部，限制最多 100 个字符
- 点击列表按钮后，桌面端左右并列展示弹幕和列表
- 移动端改为上下布局，保证在窄屏下仍能同时查看弹幕和列表
- 弹幕和列表视觉风格参考 B 站的层次与信息密度

## 非目标

- 不在本次变更中实现 MongoDB 与 GitHub 快照同步逻辑
- 不在本次变更中实现弹幕速度、密度的后台配置化存储
- 不重做整套留言后端接口，只先完成前端交互落地
- 不修改文章正文内容与现有导航结构

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 入口与弹窗挂载点
- `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx` — 新增留言弹幕弹窗
- `packages/wuh.site.next/app/post/styles/post-guestbook.ts` — 新增弹窗相关样式
- `packages/wuh.site.next/app/post/styles/post-article.ts` — 如需调整文章页底部留白
- `packages/wuh.site.nest/src/modules/comment/*` — 仅在后续联调阶段可能继续复用

## 提案

采用“弹窗 + 双区布局 + 底部输入栏”的方案：弹窗内默认只展示弹幕区域，点击列表按钮后在桌面端展开右侧列表，在移动端展开下方列表。这样可以保持弹幕是主视觉，同时保留列表浏览能力，不会把留言区做成传统表单页。

### `specs/guestbook-barrage/spec.md`
# 留言弹幕弹窗

## ADDED Requirements

### Requirement: 弹窗留言入口

#### Scenario: 用户从文章页打开留言弹幕弹窗
- **GIVEN** 用户正在浏览文章详情页
- **WHEN** 用户点击留言入口
- **THEN** 系统应打开一个居中的留言弹窗
- **AND** 弹窗内应默认展示弹幕区域
- **AND** 弹窗应提供关闭按钮以退出留言界面

### Requirement: 弹幕区域默认可见

#### Scenario: 弹窗首次打开
- **GIVEN** 用户刚打开留言弹窗
- **WHEN** 弹窗渲染完成
- **THEN** 弹幕区域应默认占据主要视觉区域
- **AND** 留言列表应默认隐藏
- **AND** 用户无需任何额外操作即可看到弹幕内容

### Requirement: 输入框字数限制

#### Scenario: 用户输入留言内容
- **GIVEN** 用户正在弹窗底部输入留言
- **WHEN** 输入内容长度达到 100 个字符
- **THEN** 输入框应停止继续增长
- **AND** 系统应保证不会提交超过 100 个字符的内容
- **AND** 页面应清晰展示剩余字数或已达上限状态

### Requirement: 桌面端左右并列展示

#### Scenario: 用户在桌面端打开列表
- **GIVEN** 用户正在使用桌面端
- **WHEN** 用户点击列表按钮
- **THEN** 弹幕区域应向左收缩
- **AND** 留言列表应在右侧展开
- **AND** 弹幕区域与列表应同屏同时可见

### Requirement: 移动端上下布局展示

#### Scenario: 用户在移动端打开列表
- **GIVEN** 用户正在使用移动端
- **WHEN** 用户点击列表按钮
- **THEN** 弹幕区域应保留在上方
- **AND** 留言列表应从下方展开
- **AND** 两者应在同一屏内上下展示

### Requirement: 弹幕与列表视觉参考 B 站

#### Scenario: 用户浏览弹幕和列表
- **GIVEN** 用户正在查看留言内容
- **WHEN** 系统渲染弹幕区域和列表区域
- **THEN** 弹幕区域应采用轨道式飘过展示
- **AND** 列表应采用头像、昵称、时间、内容的层级结构
- **AND** 两者整体应保持简洁、轻量、信息密度适中的视觉风格

### Requirement: 弹窗默认不展示列表

#### Scenario: 用户只想看弹幕
- **GIVEN** 用户没有主动点击列表按钮
- **WHEN** 弹窗打开并保持在默认状态
- **THEN** 留言列表不应占据额外空间
- **AND** 弹幕区域应保持完整宽度或主要宽度
- **AND** 输入栏应始终可用

### `tasks.md`
# 留言弹幕弹窗任务清单

## Phase 1: 弹窗入口与骨架

### Task 1: 挂载留言弹窗入口

- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`（新增）
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`（新增）
- [ ] 在文章页增加打开留言弹窗的入口
- [ ] 弹窗默认关闭，点击入口后打开
- [ ] **预计耗时:** 30 分钟
- [ ] **验证:** 本地打开文章页，点击入口可弹出留言窗口

### Task 2: 搭建弹窗结构

- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 使用现有 `Dialog` 作为容器
- [ ] 默认只渲染弹幕主区
- [ ] 预留列表区和底部输入栏位置
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** 弹窗打开后默认只显示弹幕区域

## Phase 2: 弹幕与列表布局

### Task 3: 实现弹幕主区

- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 弹幕区采用轨道式布局
- [ ] 默认弹幕区占据主要视觉区域
- [ ] 提供空态和示例内容
- [ ] **预计耗时:** 60 分钟
- [ ] **验证:** 弹窗中能看到弹幕内容和轨道层级

### Task 4: 实现列表展开与响应式布局

- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 点击列表按钮后展开列表
- [ ] 桌面端左右并列，弹幕区向左压缩
- [ ] 移动端上下布局，列表从下方展开
- [ ] **预计耗时:** 75 分钟
- [ ] **验证:** 桌面和移动端都能同屏看到弹幕和列表

## Phase 3: 输入栏与限制

### Task 5: 实现底部输入栏与 100 字限制

- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 输入框限制最大 100 字
- [ ] 输入框右侧提供列表按钮和发送按钮
- [ ] 空内容时发送按钮禁用
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** 输入超过 100 字会被截断，按钮状态正确变化

## Phase 4: 数据接入与收口

### Task 6: 对接留言数据与提交流程

- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.nest/src/modules/comment/comment.controller.ts`
- [ ] **文件:** `packages/wuh.site.nest/src/modules/comment/comment.service.ts`
- [ ] 对齐前端展示字段与后端留言字段
- [ ] 发送成功后刷新弹幕区和列表区
- [ ] 失败时显示 message 提示
- [ ] **预计耗时:** 60 分钟
- [ ] **验证:** 前端可以读取并提交真实留言数据

### Task 7: 视觉收口与可访问性

- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] 补齐 focus-visible、disabled、hover 状态
- [ ] 检查桌面端与移动端断点表现
- [ ] 检查空态、加载态、无列表态文案
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** 本地预览无横向溢出，交互状态完整

## Phase 5: 文档与验收

### Task 8: 更新 OpenSpec 记录

- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/proposal.md`
- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/specs/guestbook-barrage/spec.md`
- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/design.md`
- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/tasks.md`
- [ ] 确认 proposal、spec、design、tasks 内容一致
- [ ] 确认任务粒度在可执行范围内
- [ ] **预计耗时:** 30 分钟
- [ ] **验证:** 文档结构完整，可直接进入 apply
