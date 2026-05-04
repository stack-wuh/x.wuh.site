# Design: 弹窗纸张风

## ContactCard 改动

- Card: `background-100` + `radius-card` + elevation-card + inset 内发光
- Badge: 暗色透明 → 浅色 `background-200` tag 风格
- QR 区: 重阴影 → `var(--background-200)` 浅灰底板
- 文字: 硬编码色 → CSS 变量
- Avatar: 简化渐变，radius 统一 `var(--radius-card)`
- 去掉 `cardGradient`/`borderColor`/`hintColor` 定制化 prop

## HomeView 改动

- Dialog 加 `border-radius: var(--radius-card)`
- CONTACT_CONFIG 精简，去掉暗色定制字段
