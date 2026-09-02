# Divider 分割线

页面结构性分割线的单点负责组件，质感对齐「铅字工坊」发丝线语言。

## 用法

```tsx
import Divider from '@wuh.site/components/divider'

<Divider />                      {/* hairline 发丝线（默认） */}
<Divider variant='ornament' />   {/* 中置朱砂 ◇ 点缀线，children 可替换点缀字符 */}
<Divider style={{ margin: '8px 0' }} />
```

## API

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| variant | `hairline \| ornament` | `hairline` | 视觉变体 |
| children | ReactNode | — | 仅 ornament：替换中置点缀字符 |
| 其余 | `HTMLAttributes<HTMLDivElement>` | — | 透传（className/style 等） |

## 约束

- 渲染为 `role='separator'` 的 `div`，颜色仅用主题语义 token（发丝线 = `color-mix(in oklab, var(--normal-400) 55%, transparent)`），不使用 `prefers-color-scheme`，暗色随站点 `data-color-scheme` 自动生效。
- 正文章节记号、引用块双线等文章排版语言不属于结构分割线，不使用本组件替换。
