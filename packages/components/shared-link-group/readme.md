## SharedLinkGroup 分享链接组

用于在文章详情页底部展示分享按钮的组件，支持多种社交平台分享和复制链接功能。

### 内置类型

- `wechat` 微信
- `qq` QQ
- `weibo` 微博
- `twitter` Twitter
- `email` 邮箱
- `link` 复制链接
- `copy` 复制内容
- `custom` 自定义（需传入 `icon`）

### 尺寸

`small`（36px）| `medium`（40px，默认）| `large`（44px）

### 交互与可访问性

- 悬停：轻微上浮、脉冲光环、图标微弹跳
- 焦点：可见焦点环，键盘导航清晰
- 点击：轻微按压反馈
- 入场动画：淡入上滑效果

### 使用示例

```tsx
import SharedLinkGroup from '@wuh.site/components/shared-link-group'

// 基础分享链接
const shareItems = [
  { type: 'wechat', href: '#', title: '分享到微信' },
  { type: 'qq', href: '#', title: '分享到QQ' },
  { type: 'weibo', href: '#', title: '分享到微博' },
  { type: 'twitter', href: 'https://twitter.com/intent/tweet?text=xxx', title: '分享到Twitter' },
  { type: 'email', href: 'mailto:?subject=分享文章&body=xxx', title: '邮件分享' },
  { type: 'link', title: '复制链接', onClick: () => copyLink() },
  { type: 'copy', title: '复制内容', onClick: () => copyContent() },
]

<SharedLinkGroup items={shareItems} size="medium" label="分享到" />

// 复制链接示例
function copyLink() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => alert('链接已复制'))
    .catch(() => alert('复制失败'))
}
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| items | `{ type, href?, title?, icon?, onClick? }[]` | - | 分享项数组 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| gap | `number` | `12` | 相邻按钮的间距（px） |
| label | `string` | `'分享到'` | 分享区域的标签文本 |

### 样式与主题

- 颜色与阴影与主题变量联动：`--primary-color`、`--background-100/200/300`、`--normal-300`、`--text-primary/secondary`
- 可通过全局主题修改这些变量来自定义整体风格
- 按钮带有圆角、边框和阴影，适合作为文章底部的分享组件
