# 设计：博客列表页

## 方案

### 1. 数据获取

```ts
// GitHub Issues API
const url = `https://api.github.com/repos/stack-wuh/blog/issues`
const params = { per_page: 10, page, state: 'open', sort: 'created', direction: 'desc' }
```

### 2. 分页

- URL 参数 `?page=` 控制页码
- 使用 GitHub API Link header 判断总页数
- 分页器使用 W-u-H 字母式分页组件

### 3. 页面布局

- 复用 HomeView 卡片样式
- 响应式: 桌面三列 / 平板两列 / 手机单列
- 每页 10 条

## 依赖

- 零新依赖
