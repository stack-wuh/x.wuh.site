# 酒红主题色彩搭配优化

> 原始变更名：`redesign-wine-theme_2026_05_04`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- `specs/wine-theme-colors/spec.md`

## 决策
# 设计：酒红主题浅底深字方案

## 配色对比

### 改前（暗底深字，对比度低）

| 变量 | 值 | 对比度(对背景) |
|------|-----|---------------|
| background | #7B5A5A | — |
| text-primary | #1F1F1F | 2.2:1 ❌ |
| text-secondary | #8A7A7A | 1.4:1 ❌ |
| text-muted | #A19090 | 1.3:1 ❌ |

### 改后（浅底深字，对比度高）

| 变量 | 值 | 对比度(对背景) |
|------|-----|---------------|
| background | #F5F0EC | — |
| text-primary | #2A1E16 | 15:1 ✅ |
| text-secondary | #8A6E5C | 4.2:1 ✅ |
| text-muted | #A08878 | 2.8:1 ✅ |

## 新色阶设计

### backgroundLight（页面底/卡片色）

```
100: #FFFBF8  — 卡片表面，暖白
200: #FDF3EC  — Tag 背景
300: #FAE5D8
400: #F5D0BC
500: #EBB89E
600: #DE9A7C
700: #C88062
800: #A86A50
900: #F5F0EC  — 页面底色，暖米色
```

### normalLight（文本色）

```
100: #FFFDFB  — 最亮
200: #F8F3EE
300: #EBE2D8
400: #D4C8B8
500: #B9A998  — secondary
600: #A08878  — muted
700: #8A6E5C  — text-secondary
800: #5A4438
900: #2A1E16  — text-primary，深棕
```

### primaryLight（酒红主色，保持不变）

```
100: #FCEDEC → 500: #C94A44 → 900: #4D1515
```

## CSS 变量映射

| 变量 | 映射 | 新值 |
|------|------|------|
| --primary-color | primary.light[500] | #C94A44 |
| --text-color | normal.light[900] | #2A1E16 |
| --text-primary | normal.light[900] | #2A1E16 |
| --text-secondary | normal.light[700] | #8A6E5C |
| --text-muted | normal.light[600] | #A08878 |
| --background-color | background.light[900] | #F5F0EC |
| --accent-color | (hardcoded) | #E3B567 |
| --page-bg | (hardcoded) | linear-gradient(180deg, #F5F0EC, #FDF3EC) |

## 任务
### Phase 1 — 色阶重设计 (无依赖，可并行)
- [x] T1: `generator-color.ts` — 重设计 backgroundLight（暖粉/米色系）和 normalLight（深棕色系）
- [x] T2: `themes/index.ts` — DefaultTheme.colors.background 更新为 #F5F0EC
- [x] T3: `cssVariableProvider.tsx` — --page-bg 简化为线性渐变，--text-color 改为 normal.light[900]
### Phase 2 — 验证
- [ ] T4: 目视确认对比度合理（Node segfault 无法跑 tsc/swc）

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
schema: spec-driven
created: 2026-05-04
```

### `design.md`
# 设计：酒红主题浅底深字方案

## 配色对比

### 改前（暗底深字，对比度低）

| 变量 | 值 | 对比度(对背景) |
|------|-----|---------------|
| background | #7B5A5A | — |
| text-primary | #1F1F1F | 2.2:1 ❌ |
| text-secondary | #8A7A7A | 1.4:1 ❌ |
| text-muted | #A19090 | 1.3:1 ❌ |

### 改后（浅底深字，对比度高）

| 变量 | 值 | 对比度(对背景) |
|------|-----|---------------|
| background | #F5F0EC | — |
| text-primary | #2A1E16 | 15:1 ✅ |
| text-secondary | #8A6E5C | 4.2:1 ✅ |
| text-muted | #A08878 | 2.8:1 ✅ |

## 新色阶设计

### backgroundLight（页面底/卡片色）

```
100: #FFFBF8  — 卡片表面，暖白
200: #FDF3EC  — Tag 背景
300: #FAE5D8
400: #F5D0BC
500: #EBB89E
600: #DE9A7C
700: #C88062
800: #A86A50
900: #F5F0EC  — 页面底色，暖米色
```

### normalLight（文本色）

```
100: #FFFDFB  — 最亮
200: #F8F3EE
300: #EBE2D8
400: #D4C8B8
500: #B9A998  — secondary
600: #A08878  — muted
700: #8A6E5C  — text-secondary
800: #5A4438
900: #2A1E16  — text-primary，深棕
```

### primaryLight（酒红主色，保持不变）

```
100: #FCEDEC → 500: #C94A44 → 900: #4D1515
```

## CSS 变量映射

| 变量 | 映射 | 新值 |
|------|------|------|
| --primary-color | primary.light[500] | #C94A44 |
| --text-color | normal.light[900] | #2A1E16 |
| --text-primary | normal.light[900] | #2A1E16 |
| --text-secondary | normal.light[700] | #8A6E5C |
| --text-muted | normal.light[600] | #A08878 |
| --background-color | background.light[900] | #F5F0EC |
| --accent-color | (hardcoded) | #E3B567 |
| --page-bg | (hardcoded) | linear-gradient(180deg, #F5F0EC, #FDF3EC) |

### `proposal.md`
# 酒红主题色彩搭配优化

## 为什么做

当前酒红主题背景是暖棕色（#7B5A5A，暗色），但文本色系 normalLight 是为浅色背景设计的深色文字（#1F1F1F ~ #A19090）。深色文字配深色背景，对比度极低（text-primary 仅 2.2:1，text-muted 仅 1.3:1），阅读吃力。

## 做什么

- 将酒红主题从"深色背景"改为"浅色背景"方案
- 重新设计 backgroundLight 色阶为暖粉/米色系（页面底 #F5F0EC）
- 重新设计 normalLight 色阶为深棕色系（在浅背景上有充足对比度）
- 保持酒红主色（#C94A44）和金色点缀（#E3B567）不变
- 简化 page-bg 为干净的线性渐变

## 影响范围

- `packages/components/themes/generator-color.ts` — backgroundLight, normalLight 色阶重设计
- `packages/components/themes/index.ts` — DefaultTheme.colors.background 更新
- `packages/components/themes/cssVariableProvider.tsx` — --page-bg 简化，--text-color 改为深色
- 首页 Hero/格言/博客列表/项目列表 — CSS 变量自动跟随
- SiteHeader — 自动跟随

## 不改什么

- 主色 primary（酒红 #C94A44）保持不变
- 素雅主题（plain）不受影响
- dark mode 色阶保持不变
- 组件结构/SiteHeader/HomeView 不动

### `specs/wine-theme-colors/spec.md`
# Spec: wine-theme-colors

## CHANGED

### Requirement: 酒红主题浅色背景

GIVEN 用户以酒红主题（默认）访问网站
WHEN 页面渲染完成
THEN `--background-color` 为浅暖米色（#F5F0EC）
AND `--text-primary` 在背景上对比度 >= 10:1
AND `--text-secondary` 在背景上对比度 >= 4:1
AND `--text-muted` 在背景上对比度 >= 2.5:1

### Requirement: 酒红主题色彩一致性

GIVEN 酒红主题
WHEN 查看首页 Hero/格言/博客列表/项目列表
THEN 主色保持 #C94A44（酒红）
AND 辅助色保持 #E3B567（金）
AND 页面背景为干净的线性渐变，无径向渐变干扰
AND 文本清晰可读

### Requirement: 不影响素雅主题

GIVEN 用户切换到素雅主题
WHEN 页面重新渲染
THEN 素雅主题（纸张风）的颜色、背景、文本完全不受影响
AND `:root[data-theme='plain']` CSS 规则保持不变

### `tasks.md`
# 任务拆分

## Phase 1 — 色阶重设计 (无依赖，可并行)

- [x] T1: `generator-color.ts` — 重设计 backgroundLight（暖粉/米色系）和 normalLight（深棕色系）
- [x] T2: `themes/index.ts` — DefaultTheme.colors.background 更新为 #F5F0EC
- [x] T3: `cssVariableProvider.tsx` — --page-bg 简化为线性渐变，--text-color 改为 normal.light[900]

## Phase 2 — 验证

- [ ] T4: 目视确认对比度合理（Node segfault 无法跑 tsc/swc）
