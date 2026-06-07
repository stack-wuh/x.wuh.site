# 设计文档

## 1. 文件长度

- 单文件不超过 300 行，超过时拆分
- 拆分方式：样式拆到 styles/ 目录，子组件拆到 components/ 目录

## 2. 注释

- 所有导出函数、组件必须加 JSDoc（描述用途、参数、返回值）
- 复杂/反直觉的逻辑处加行内注释解释"为什么"
- 自解释代码不加注释

## 3. 样式组织

- styled-components 统一定义在独立的 styles/index.ts 文件中
- 组件文件通过 `import * as S from './styles'` 命名空间导入
- app 层和组件库使用统一的 styles/index.ts 模式

## 4. 目录结构

```
# 页面级（样式多，需要子文件拆分时）
app/post/styles/
  index.ts          # 统一导出
  post-content.ts   # 正文样式
  post-toolbar.ts   # 工具栏样式

# 页面级（样式少，单个文件）
app/about/styles/
  index.ts

# 组件级
app/components/SiteHeader/
  index.tsx          # 组件逻辑
  styles/index.ts    # 样式
```

## 5. 需要整改的文件

### 必须拆分（超过 300 行）

| 文件 | 行数 | 拆分方式 |
|------|------|---------|
| app/post/styles/index.ts | 1102 | 按板块拆为 post-content.ts、post-toolbar.ts、post-toc.ts |
| app/HomeView.tsx | 715 | 样式拆到 HomeView.styles.ts，子组件拆到 components/ |
| app/blog/BlogListView.tsx | 387 | 样式拆到 blog/styles/，子组件拆出 |
| app/components/SiteHeader.tsx | 325 | 样式拆到 SiteHeader/styles/index.ts |
