# HomeView

首页视图组件，展示 Hero、格言、社交链接、精选博客、年度总结、微信读书和精选项目。

## 用法

```tsx
<HomeView repos={repos} posts={posts} yearlySummaries={summaries} wereadBooks={books} />
```

## 说明

- 数据通过 props 传入，组件内部用 useFetch 补充客户端数据。
- 样式从 `app/styles` 共享导出。
