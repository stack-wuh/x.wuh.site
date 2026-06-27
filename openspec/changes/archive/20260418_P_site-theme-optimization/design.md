# 设计：网站主题优化

## 方案

### 1. Design Tokens

CSS 变量扩展为四分支:
- `light-wine` / `dark-wine`（100 元主题）
- `light-plain` / `dark-plain`（素雅主题）

```
--color-bg-primary: #7B5A5A (wine) / #FAFAF5 (plain)
--color-bg-card: #FFF3F0 (wine) / #FFFFFF (plain)
--color-primary: #C94A44
--color-accent: #E3B567
--font-size-hero: 56px
--font-size-title: 28-32px
--font-size-body: 18px
--space-8: 8px ... --space-80: 80px
--radius-card: 16-20px
--radius-pill: 999px
--shadow-default: 0 20px 40px rgba(0,0,0,0.08)
```

### 2. 页面布局

- 主容器宽度: 1100-1200px，居中
- 首页: 3 列卡片（桌面）/ 2 列（平板≤1024px）/ 1 列（手机≤768px）
- 文章详情: 正文宽度 780-820px，居中

### 3. TOC

- 桌面端: 右侧固定，scroll spy 高亮当前章节
- 移动端: 折叠/抽屉/置底卡片
- 键盘可导航

## 依赖

- 零新依赖
