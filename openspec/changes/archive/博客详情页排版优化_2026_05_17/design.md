# 技术方案：双主题独立排版 Token

## Token 架构

```
:root {
  --font-size-*:      <酒红值>
  --line-height-body:   <酒红值>
  --line-height-heading:<酒红值>
}

:root[data-theme='plain'] {
  --font-size-*:      <素雅独立值>
  --line-height-body:   <素雅独立值>
  --line-height-heading:<素雅独立值>
}
```

## 字号 Token（双主题独立）

| Token | 酒红 | 素雅 | 用途 |
|-------|------|------|------|
| `--font-size-base` | 16px | 16px | 正文 |
| `--font-size-sm` | 14px | 15px | 元信息 |
| `--font-size-md` | 18px | 17px | 强调 |
| `--font-size-lg` | 20px | 19px | 小标题 |
| `--font-size-xl` | 24px | 22px | h3/h4 |
| `--font-size-2xl` | 30px | 27px | 文章标题/h1/h2 |

设计意图：酒红偏现代张扬（字稍大、紧凑），素雅偏内敛克制（字稍小、呼吸感）。

## 行高 Token（双主题独立）

| Token | 酒红 | 素雅 | 用途 |
|-------|------|------|------|
| `--line-height-body` | 1.8 | 2.0 | 段落 |
| `--line-height-heading` | 1.35 | 1.4 | 标题 |

## 色彩对比度原则

1. 正文 ≥ 4.5:1（WCAG AA）— `--text-primary` vs 背景
2. 辅助文 ≥ 3:1 — `--text-secondary` / `--text-muted`
3. 素雅 dark 补全缺失的 `--normal-*` 和 `--background-*` 变量
4. 代码块背景与代码字色 ≥ 4.5:1

实现时 DevTools 逐组合调色，不预先承诺具体色值。

## MarkdownBody 改造

```css
/* 从硬编码 em 改为 CSS 变量引用 */
h1 { font-size: var(--font-size-2xl); }
h2 { font-size: var(--font-size-xl); }
h3 { font-size: var(--font-size-lg); }
p  { font-size: var(--font-size-base); line-height: var(--line-height-body); }
```

## 影响分析

- `cssVariableProvider.tsx`：新增 `--line-height-*` token 渲染，`[data-theme='plain']` 下覆写字号/行高，补全素雅 dark 变量
- `styles/index.ts`：MarkdownBody 标题/段落引用 CSS 变量替代 em
- 不影响现有组件库的视觉一致性（字号 token 名不变，值根据需要覆写）
