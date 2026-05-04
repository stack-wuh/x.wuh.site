# Design System

## MODIFIED

### Requirement: 暖纸色系替代金色系
设计令牌颜色体系从暖红/金色调切换为纸张/墨水/陶土色系。

- **GIVEN** 站点加载 CSS 变量
- **WHEN** 用户访问任意页面
- **THEN** primary 色阶为暖赭色 (#C89060)，background 为象牙白纸色 (#FFFDF9)，accent 为 #C89060

### Requirement: 衬线字体变量
CSS 变量 --font-serif 指向系统衬线字体栈。

- **GIVEN** CSS 变量可用
- **WHEN** 标题/引言/格言区渲染
- **THEN** 使用 Georgia / Songti SC / STSong / serif 字体栈，font-weight: 500

### Requirement: 主题色阶重写
generator-color.ts 输出暖纸色阶替代原暖金阶。

- **GIVEN** generator-color 生成色阶
- **WHEN** primary/background/normal 三色阶被请求
- **THEN** Light: 象牙底+深棕墨+陶土点缀；Dark: 深灰底+暖白文+暖赭点缀

### Requirement: 设计令牌微调
字号/间距/圆角微调以匹配纸张风格。

- **GIVEN** ThemeProvider 注入令牌
- **WHEN** 组件使用 fontSize/spaces/borderRadius tokens
- **THEN** base: 15px, md: 28px, lg: 36px, borderRadius.base: 8px

## REMOVED

### Requirement: 金色 accent
废除 #E3B567 金色 accent 色。

- **GIVEN** CSS 变量注入
- **WHEN** 新主题加载
- **THEN** --accent-color 不再为金色，替换为暖赭色 #C89060
