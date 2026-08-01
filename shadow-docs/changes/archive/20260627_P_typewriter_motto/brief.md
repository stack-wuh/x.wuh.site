# 首页打字动画标语

> 原始变更名：`20260627_P_typewriter_motto`

## 元数据
- 日期：2026-06-27
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
首页 Motto blockquote 静态显示"写作是抵抗遗忘的方式，代码是构建世界的语言"，缺乏互动感。改为打字机动画，Sequential 循环播放两句标语，配合粒子+光晕效果，增强视觉吸引力。

## 引用规范
- `specs/design-system/spec.md`

## 决策
# 技术方案

## 组件结构

```
app/components/TypewriterMotto/
├── index.tsx    # 状态机 + 粒子逻辑
└── styles.ts    # Container/Cursor/Glow/ParticleDot
```

## 状态机

```
typing → (text === target) → pausing → (3.5s) → deleting
→ (text === '') → switching → (1s) → typing (下一句)
```

- TYPING_MS: 100ms，DELETING_MS: 50ms
- 粒子在 typing 阶段每个字符插入时生成 2-3 个

## 视觉效果

- **Cursor**: `border-left` + `@keyframes tk-blink` step-end 闪烁
- **Glow**: 绝对定位在光标位置，`radial-gradient` + `blur(7px)` 光晕
- **ParticleDot**: 2-3 个微小圆点，使用 CSS 自定义属性 `--a`(角度) `--d`(距离) 驱动 `translate` 飘散

## HomeView 集成

- `next/dynamic` 懒加载，加载时显示 `MottoSkeleton` 占位
- `Motto` styled-component 移除，替换为 `MottoSkeleton`

## 任务
### Phase 1: 组件实现
- [x] **Task 1: 创建 TypewriterMotto 组件** — `app/components/TypewriterMotto/index.tsx` + `styles.ts` — 预估: 20min | 实际: 15min
### Phase 2: 集成
- [x] **Task 2: 替换 HomeView Motto** — `app/HomeView.tsx` + `app/styles/index.ts` — 预估: 5min | 实际: 5min

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: typewriter-motto
date: 2026-06-27
type: P
status: applied
```

### `design.md`
# 技术方案

## 组件结构

```
app/components/TypewriterMotto/
├── index.tsx    # 状态机 + 粒子逻辑
└── styles.ts    # Container/Cursor/Glow/ParticleDot
```

## 状态机

```
typing → (text === target) → pausing → (3.5s) → deleting
→ (text === '') → switching → (1s) → typing (下一句)
```

- TYPING_MS: 100ms，DELETING_MS: 50ms
- 粒子在 typing 阶段每个字符插入时生成 2-3 个

## 视觉效果

- **Cursor**: `border-left` + `@keyframes tk-blink` step-end 闪烁
- **Glow**: 绝对定位在光标位置，`radial-gradient` + `blur(7px)` 光晕
- **ParticleDot**: 2-3 个微小圆点，使用 CSS 自定义属性 `--a`(角度) `--d`(距离) 驱动 `translate` 飘散

## HomeView 集成

- `next/dynamic` 懒加载，加载时显示 `MottoSkeleton` 占位
- `Motto` styled-component 移除，替换为 `MottoSkeleton`

### `proposal.md`
# 首页打字动画标语

## 动机

首页 Motto blockquote 静态显示"写作是抵抗遗忘的方式，代码是构建世界的语言"，缺乏互动感。改为打字机动画，Sequential 循环播放两句标语，配合粒子+光晕效果，增强视觉吸引力。

## 变更范围

- 新建 TypewriterMotto 组件：打字/停顿/回删/切换 4 态状态机
- 第二句标语："不要停步不前，每一天都要做出改变"
- 视觉效果：打字光标闪烁 + 字符出现溅出粒子 + 光标附近 glow 光晕
- 替换 HomeView 中的 `<S.Motto>` 静态标签

## 非目标

- 不改变 Motto 区域在页面中的位置和布局
- 不修改其他页面

## 影响

- 前端: HomeView.tsx, styles/index.ts
- 新增: app/components/TypewriterMotto/

### `specs/design-system/spec.md`
# Design System

## ADDED: TypewriterMotto 打字动画

### Requirement: 首页标语打字动画
- **GIVEN** 用户访问首页
- **WHEN** Motto 区域渲染
- **THEN** 标语以打字机效果逐字显示，尾部有闪烁光标
- **AND** 每个字符出现时溅出 2-3 个粒子光点
- **AND** 光标附近有 glow 模糊光晕
- **AND** 第一句打完停顿 3.5s 后逐字回删
- **AND** 回删完成后切换为第二句继续打字
- **AND** 两句循环播放："写作是抵抗遗忘的方式，代码是构建世界的语言。" / "不要停步不前，每一天都要做出改变。"

## MODIFIED: HomeView Motto 区域

### Requirement: Motto 替换为 TypewriterMotto
- **GIVEN** HomeView 渲染
- **WHEN** Motto 区域位置
- **THEN** 显示 TypewriterMotto 动态组件代替旧 `<S.Motto>` 静态 blockquote
- **AND** 动态导入加载时显示 MottoSkeleton 占位

### `tasks.md`
# 任务清单

## Phase 1: 组件实现

- [x] **Task 1: 创建 TypewriterMotto 组件** — `app/components/TypewriterMotto/index.tsx` + `styles.ts` — 预估: 20min | 实际: 15min

## Phase 2: 集成

- [x] **Task 2: 替换 HomeView Motto** — `app/HomeView.tsx` + `app/styles/index.ts` — 预估: 5min | 实际: 5min
