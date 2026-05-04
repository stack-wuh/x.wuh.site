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
