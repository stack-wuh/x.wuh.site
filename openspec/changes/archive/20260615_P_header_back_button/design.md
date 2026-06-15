# Blog/Weread Header 统一 & 返回首页按钮重设计

日期：2026-06-15 | 类型：需求 | 状态：approved

## 目标

统一 blog 和 weread 页面的 Header 布局，用现有 Button 组件实现"精致考究"的返回首页交互，替换当前过于简洁的纯文字链接。

## 范围

- **改**: blog 页 Header、weread 页 Header、新增共享组件
- **不改**: Button 组件本身、Post 详情页、SiteHeader 全局导航栏

## 设计

### 交互风格

"精致考究"——有视觉存在感但不喧宾夺主，过渡动画顺滑。hover 时图标微移、下划线淡入。

### 布局统一

blog 和 weread 的页面 Header 统一为"标题左、返回按钮右"的水平排列：

```
[标题 + 副标题]                    [← 返回首页]
```

### BackHomeLink 组件

新增 `app/components/BackHomeLink/`，用现有 Button 组件封装：

```tsx
<BackHomeLink href="/" label="返回首页" />
```

视觉规格：

| 属性 | 值 |
|------|-----|
| Button variant | text |
| Button color | secondary |
| 图标 | IconChevronLeft (14px) |
| 字号 | 13px |
| 字重 | 450 |
| 默认色 | #78716c (中性灰) |
| 内边距 | 6px 4px |
| 底部装饰线 | 1.5px transparent → hover primary |

交互状态：

| 状态 | 效果 |
|------|------|
| 默认 | 图标 + 文字，中性灰，无下划线 |
| hover | 图标右移 3px，底部 primary 色下划线淡入，文字色微暖 |
| active | 图标位移回弹 |
| focus-visible | 2px primary outline + 2px offset |
| prefers-reduced-motion | 禁用所有动画 |

### PageHeader 共享布局

新增 `app/components/PageHeader/`，从 blog/styles 提取：

- `Header` — 水平 flex，space-between
- `TitleGroup` — 标题 + 副标题列
- `Title` — h1，serif，xl
- `Subtitle` — muted text
- `HeaderActions` — 右侧操作区 flex

### 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/components/PageHeader/styles.ts` | 新增 | 共享 Header 布局组件 |
| `app/components/BackHomeLink/index.tsx` | 新增 | 返回首页链接 |
| `app/blog/styles/index.ts` | 修改 | 删除提取出的组件，从 PageHeader 重导出 |
| `app/blog/BlogListView.tsx` | 修改 | BackLink → BackHomeLink |
| `app/weread/WereadView.tsx` | 修改 | 改为水平 Header，引入 PageHeader + BackHomeLink |
