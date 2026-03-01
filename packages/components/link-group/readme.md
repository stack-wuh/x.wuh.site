## LinkGroup 联系方式链接组

展示一组社交/联系方式的圆形链接按钮，内置图标与动画交互，可扩展自定义图标。

### 内置类型

- `wechat` 微信
- `qq` QQ
- `twitter` Twitter
- `email` 邮箱
- `github` GitHub
- `douban` 豆瓣
- `custom` 自定义（需传入 `icon`）

### 尺寸

`small`（32px）| `medium`（40px，默认）| `large`（48px）

### 交互与可访问性

- 悬停：轻微上浮与脉冲光环、图标微旋转
- 焦点：可见焦点环，键盘导航清晰
- 点击：轻微按压反馈

### 使用示例

```tsx
import LinkGroup from '@wuh.site/components/link-group'

const items = [
  { type: 'wechat', href: 'https://example.com/wechat', title: '微信' },
  { type: 'qq', href: 'https://example.com/qq', title: 'QQ' },
  { type: 'twitter', href: 'https://twitter.com/stack_wuh', title: 'Twitter' },
  { type: 'email', href: 'mailto:shadow_u@foxmail.com', title: '邮箱' },
  { type: 'github', href: 'https://github.com/stack-wuh', title: 'GitHub' },
  { type: 'douban', href: 'https://www.douban.com/people/xxx', title: '豆瓣' },
]

<LinkGroup items={items} size="medium" />
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| items | `{ type, href, title?, icon? }[]` | - | 链接项数组 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| gap | `number` | `12` | 相邻链接的间距（px） |

### 样式与主题

- 颜色与阴影与主题变量联动：`--primary-color`、`--background-100/200`、`--normal-300`、`--text-primary/secondary`
- 可通过全局主题修改这些变量来自定义整体风格
