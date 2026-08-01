# 粘性按钮组优化

> 原始变更名：`20260308_P_sticky-button-group`

## 元数据
- 日期：2026-03-08
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：粘性按钮组优化

## 方案

### 1. 按钮组结构（优化后）

```
FloatButtonGroup
├── BackToTopBtn（回到页头 + 渐变进度背景）
├── BackToHomeBtn（返回首页）
└── LikeBtn（点赞占位）
```

### 2. 渐变进度

- 回到页头按钮背景根据 scrollPercent 动态渐变
- CSS 渐变方向: 从左到右
- 颜色: 主色渐变（如 #C94A44 → #A13531）
- light/dark 模式自动切换渐变色

### 3. SSR 安全

- scrollPercent 在客户端 useEffect 中计算
- 渐变通过 CSS custom property 或 inline style 注入

## 依赖

- 零新依赖

## 任务
### Phase 1 — 按钮组优化
- [ ] T1: 移除进度按钮 + 渐变样式迁移
### Phase 2 — 验证
- [ ] T2: 验证按钮功能与渐变

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 粘性按钮组优化
change: sticky-button-group
date: 2026-03-08
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/45
```

### `design.md`
# 设计：粘性按钮组优化

## 方案

### 1. 按钮组结构（优化后）

```
FloatButtonGroup
├── BackToTopBtn（回到页头 + 渐变进度背景）
├── BackToHomeBtn（返回首页）
└── LikeBtn（点赞占位）
```

### 2. 渐变进度

- 回到页头按钮背景根据 scrollPercent 动态渐变
- CSS 渐变方向: 从左到右
- 颜色: 主色渐变（如 #C94A44 → #A13531）
- light/dark 模式自动切换渐变色

### 3. SSR 安全

- scrollPercent 在客户端 useEffect 中计算
- 渐变通过 CSS custom property 或 inline style 注入

## 依赖

- 零新依赖

### `proposal.md`
# 粘性按钮组优化

## 为什么做

浮动按钮组中的独立进度按钮占用空间，阅读进度数字反馈不够直观。需要将进度视觉迁移到"回到页头"按钮，减少按钮数量。

## 做什么

- 移除浮动按钮组中的阅读进度按钮及相关 DOM/样式
- 复用渐变填充逻辑，使"回到页头"按钮根据滚动进度展示渐变背景
- 保留回到页头/返回首页/点赞按钮的事件、拖拽吸附逻辑
- light/dark 适配
- 可访问性（aria-label、focus）更新

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 移除进度按钮 + 渐变迁移
- `packages/wuh.site.next/app/post/styles/index.ts` — 样式更新

### `tasks.md`
# 任务拆分

## Phase 1 — 按钮组优化

- [ ] T1: 移除进度按钮 + 渐变样式迁移
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`, styles
  - 产出: 回到页头按钮展示渐变进度

## Phase 2 — 验证

- [ ] T2: 验证按钮功能与渐变
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证滚动渐变、拖拽吸附、dark mode、reduced-motion
