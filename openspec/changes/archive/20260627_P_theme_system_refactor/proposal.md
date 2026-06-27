# 主题系统系统性重构

## 问题

当前主题系统有 4 套硬编码 CSS 变量（酒红 light/dark + 素雅 light/dark），但存在以下系统性问题：

1. **两个正交维度被耦合** — `data-theme` 只控制色板族（酒红/素雅），明暗完全由系统 `prefers-color-scheme` 决定，无法手动切换
2. **命名不统一** — `cssVariablesGenerator` 与 `cssVariableProvider.tsx` 各自生成不同命名的 CSS 变量，前者完全未使用
3. **`/design/system-color` 页面与真实系统脱节** — 展示中国红 `#E60000`，不反映实际色板
4. **新组件开发时缺少结构性约束** — 开发者很少意识到某个 CSS 变量在不同主题下的变化

## 目标

将主题系统重构为两个正交维度的组合：

- **色板族** (ThemeFamily): `wine` / `plain`（对应酒红/素雅）
- **色彩模式** (ColorScheme): `light` / `dark`

用 HTML 双属性 `data-theme-family` + `data-color-scheme` 替换当前单一 `data-theme`。

CSS 变量采用"Layer 1 私有调色板 + Layer 2 路由选择器"的组合覆盖架构，消除硬编码 4 分支。

切换按钮从 2 态循环变为 4 态循环：酒红明亮 / 酒红暗黑 / 素雅明亮 / 素雅暗黑。

## 范围

- 重构 `themes/` 下的颜色生成、CSS 变量注入、Token 类型
- 重写 `ThemeModeProvider` 为 4 态 + localStorage
- 更新 `SiteHeader` 切换按钮
- 重建 `/design/system-color` 为 Design Token 调试面板
- 清理死代码 `cssVariablesGenerator` / `cssVariablesTokens`
- 更新 `openspec/specs/design-system/spec.md`
