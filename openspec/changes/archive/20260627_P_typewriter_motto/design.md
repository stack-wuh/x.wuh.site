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
