# 修复首页 Head 区域酒红/素雅主题切换失效

> 原始变更名：`fix-theme-toggle_2026_05_04`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- `specs/theme-toggle/spec.md`

## 决策
# 设计：酒红/素雅双主题

## 主题定义

### 酒红（money，默认 `:root`）
- 主色色阶：暖红系 #C94A44（500）/ #A13531（600 hover）
- 文本色系：暖灰（#FFFDFD ~ #1F1F1F）
- 背景色系：暖红粉棕（#FFF3F0 ~ #7B5A5A）
- 辅助色 accent：金色 #E3B567
- 页面背景：径向渐变叠加暖红色调

### 素雅（plain，`:root[data-theme='plain']`）
- 主色色阶：陶土赭 #C89060（500）/ #A87348（600）
- 文本色系：深棕墨迹（#FDFCFA ~ #2A2218）
- 背景色系：象牙白纸色（#FFFDF9 ~ #F2EDE4）
- 辅助色 accent：#C89060
- 页面背景：线性渐变淡纸色

## 切换机制
- ThemeModeProvider 管理 mode 状态（localStorage 持久化）
- `document.documentElement.dataset.theme = mode`
- 纯 CSS 属性选择器 `:root[data-theme='plain']` 覆盖默认变量
- 不依赖 React re-render，浏览器原生 CSS 级联处理

## 任务
### Phase 1 — 恢复酒红色系 (无依赖，可并行)
- [x] T1: `generator-color.ts` — 默认色系从纸张风恢复为酒红暖色系（#C94A44 主色）
- [x] T2: `themes/index.ts` — DefaultTheme.colors 同步恢复酒红色系
- [x] T3: `cssVariableProvider.tsx` — 默认 `:root` 硬编码值（accent-color, page-bg, elevations）恢复酒红风格，修复 `--text-color` 为浅色匹配深色背景
### Phase 2 — 验证
- [ ] T4: `pnpm exec tsc --noEmit` TypeScript 类型检查

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
# 设计：酒红/素雅双主题

## 主题定义

### 酒红（money，默认 `:root`）
- 主色色阶：暖红系 #C94A44（500）/ #A13531（600 hover）
- 文本色系：暖灰（#FFFDFD ~ #1F1F1F）
- 背景色系：暖红粉棕（#FFF3F0 ~ #7B5A5A）
- 辅助色 accent：金色 #E3B567
- 页面背景：径向渐变叠加暖红色调

### 素雅（plain，`:root[data-theme='plain']`）
- 主色色阶：陶土赭 #C89060（500）/ #A87348（600）
- 文本色系：深棕墨迹（#FDFCFA ~ #2A2218）
- 背景色系：象牙白纸色（#FFFDF9 ~ #F2EDE4）
- 辅助色 accent：#C89060
- 页面背景：线性渐变淡纸色

## 切换机制
- ThemeModeProvider 管理 mode 状态（localStorage 持久化）
- `document.documentElement.dataset.theme = mode`
- 纯 CSS 属性选择器 `:root[data-theme='plain']` 覆盖默认变量
- 不依赖 React re-render，浏览器原生 CSS 级联处理

### `proposal.md`
# 修复首页 Head 区域酒红/素雅主题切换失效

## 为什么做

"文青纸张风 UI 重新设计" 将默认主题（酒红）和 `data-theme='plain'`（素雅）都统一为纸张风色系，两套主题的 CSS 变量值几乎一致，点切换按钮看不出变化，主题切换功能实质上已失效。

## 做什么

- 将默认主题（酒红 money）从纸张风恢复为酒红暖色系（主色 #C94A44，金辅助色 #E3B567）
- 素雅主题（plain）保持纸张风（象牙白纸底/陶土赭色）
- 修复 `--text-color` 变量，酒红主题恢复使用浅色文字匹配深色背景

## 影响范围

- `packages/components/themes/generator-color.ts` — 恢复酒红色阶
- `packages/components/themes/index.ts` — DefaultTheme.colors 同步
- `packages/components/themes/cssVariableProvider.tsx` — 默认 :root 硬编码值恢复酒红风格
- 首页 Hero/格言区/博客列表/项目列表 — CSS 变量自动跟随主题
- SiteHeader 主题切换按钮 — 两套视觉差异恢复
- Button/Tag/Skeleton 组件 — 颜色变量自动切换

## 不改什么

- 素雅主题（`:root[data-theme='plain']`）CSS 值保持不变
- ThemeModeProvider 切换逻辑不变
- SiteHeader 按钮 UI 不变
- HomeView/BlogListView 等页面组件不改

### `specs/theme-toggle/spec.md`
# Spec: theme-toggle

## FIXED

### Requirement: 酒红主题色系

默认 `:root` 必须使用酒红色系（非纸张风）。

GIVEN 用户访问网站（默认主题为 money）
WHEN 页面渲染完成
THEN `--primary-color` 值为 #C94A44（暖红）
AND `--accent-color` 值为 #E3B567（金）
AND `--background-color` 为暖棕色调
AND 页面背景使用径向渐变叠加暖红色

### Requirement: 素雅主题色系

`:root[data-theme='plain']` 使用纸张风色系。

GIVEN 用户点击主题按钮切换到素雅
WHEN `document.documentElement.dataset.theme` 变为 'plain'
THEN `--primary-color` 值为 #C89060（陶土赭）
AND `--accent-color` 值为 #C89060
AND `--background-color` 为象牙白纸色
AND 页面背景为线性渐变淡纸色

### Requirement: 两套主题有明显视觉差异

GIVEN 用户在同一设备上
WHEN 在酒红和素雅之间切换
THEN 页面色系从暖红/金变为象牙白/陶土赭
AND 变化肉眼可见

### Requirement: 主题切换不影响 dark mode 分支

GIVEN 系统处于 dark 主题
WHEN 用户在酒红和素雅之间切换
THEN 两套主题在 dark mode 下各自有明显差异
AND `@media (prefers-color-scheme: dark)` 规则正确生效

### `tasks.md`
# 任务拆分

## Phase 1 — 恢复酒红色系 (无依赖，可并行)

- [x] T1: `generator-color.ts` — 默认色系从纸张风恢复为酒红暖色系（#C94A44 主色）
- [x] T2: `themes/index.ts` — DefaultTheme.colors 同步恢复酒红色系
- [x] T3: `cssVariableProvider.tsx` — 默认 `:root` 硬编码值（accent-color, page-bg, elevations）恢复酒红风格，修复 `--text-color` 为浅色匹配深色背景

## Phase 2 — 验证

- [ ] T4: `pnpm exec tsc --noEmit` TypeScript 类型检查
