# 浮动按钮组

> 原始变更名：`20260322_P_float-button`

## 元数据
- 日期：2026-03-22
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：浮动按钮组

## 方案

### 1. 按钮组结构

```
FloatButtonGroup（position: fixed, 右下）
├── ScrollProgressBtn（阅读进度数字）
├── BackToTopBtn（回到页头 + 平滑滚动）
├── BackToHomeBtn（返回首页 Link）
└── LikeBtn（点赞占位）
```

### 2. 交互

- 拖拽: mousedown/touchstart → mousemove/touchmove → mouseup/touchend
- 吸附: 释放时判断距离左/右边缘，吸附到最近一侧
- 纵向边界: 避免遮挡导航栏和底部内容
- 按钮宽度一致，无间隙

### 3. 样式

- 固定定位 `position: fixed`
- 移动端缩小边距
- aria-label 可访问性标注
- 暗色模式适配

### 4. SSR 安全

- window/document 访问需 guard
- 滚动进度计算在 useEffect 中注册

## 依赖

- 零新依赖

## 任务
### Phase 1 — FloatButton 实现
- [ ] T1: 实现浮动按钮组与滚动进度
- [ ] T2: 实现拖拽吸附逻辑
### Phase 2 — 验证
- [ ] T3: 验证按钮功能与拖拽

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 浮动按钮组
change: float-button
date: 2026-03-22
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/43
```

### `design.md`
# 设计：浮动按钮组

## 方案

### 1. 按钮组结构

```
FloatButtonGroup（position: fixed, 右下）
├── ScrollProgressBtn（阅读进度数字）
├── BackToTopBtn（回到页头 + 平滑滚动）
├── BackToHomeBtn（返回首页 Link）
└── LikeBtn（点赞占位）
```

### 2. 交互

- 拖拽: mousedown/touchstart → mousemove/touchmove → mouseup/touchend
- 吸附: 释放时判断距离左/右边缘，吸附到最近一侧
- 纵向边界: 避免遮挡导航栏和底部内容
- 按钮宽度一致，无间隙

### 3. 样式

- 固定定位 `position: fixed`
- 移动端缩小边距
- aria-label 可访问性标注
- 暗色模式适配

### 4. SSR 安全

- window/document 访问需 guard
- 滚动进度计算在 useEffect 中注册

## 依赖

- 零新依赖

### `proposal.md`
# 浮动按钮组

## 为什么做

博客详情页内容较长，需要在右下角提供常用操作与阅读进度提示，方便用户快速导航。

## 做什么

- 在详情页右下角新增 FloatButton 组
- 支持返回首页
- 支持返回页头（平滑滚动）
- 支持点赞（先用占位提示）
- 展示当前滚动进度数字（不带百分号）
- 每个按钮宽度一致，连续一体无间隙
- 支持鼠标拖放，仅能吸附左侧或右侧

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 接入
- `packages/wuh.site.next/app/post/styles/index.ts` — 样式

### `tasks.md`
# 任务拆分

## Phase 1 — FloatButton 实现

- [ ] T1: 实现浮动按钮组与滚动进度
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`
  - 产出: 浮动按钮组 + 滚动进度数字

- [ ] T2: 实现拖拽吸附逻辑
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`
  - 产出: 可拖拽按钮组，左右侧吸附

## Phase 2 — 验证

- [ ] T3: 验证按钮功能与拖拽
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证返回首页/页头、拖动吸附、进度准确、移动端无遮挡
