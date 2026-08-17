# Button

主题按钮组件，支持按钮和链接两种渲染形态。

## 用法

```tsx
<Button variant='filled' color='primary'>确认</Button>
<Button href='/blog' variant='outlined'>查看博客</Button>
```

## 关键 Props

- `variant`：`filled`、`outlined`、`text`。
- `color`：`primary`、`secondary`、`success`、`warning`、`danger`。
- `size`：`small`、`medium`、`large`。
- `href`：存在且未禁用时渲染为链接。
- `icon` / `iconPosition`：图标内容与位置。
