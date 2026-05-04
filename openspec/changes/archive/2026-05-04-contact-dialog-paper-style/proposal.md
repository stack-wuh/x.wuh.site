# QQ/微信弹窗纸张风改造

## 问题

ContactCard 使用暗色渐变 + 玻璃质地 + backdrop-filter，与整体纸张风不搭。文字颜色硬编码不跟主题走。

## 方案

全部改为纸张风，Cart 去掉暗色渐变，改用 `var(--background-100)` + 纸张风阴影 + `radius-card` 圆角。

## Scope

2 个文件：`ContactCard.tsx` + `HomeView.tsx`
