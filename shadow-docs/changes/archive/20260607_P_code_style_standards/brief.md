# 代码风格约定

> 原始变更名：`20260607_P_code_style_standards`

## 元数据
- 日期：2026-06-07
- 类型：P
- 状态：approved
- Issue：历史记录未提供

## 动机
当前项目存在以下问题：
- 4 个文件超过 300 行，其中 post/styles/index.ts 高达 1102 行
- 91% 的文件零 JSDoc 注释
- 样式组织不统一：app 层大部分页面样式和组件逻辑混在同一文件

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
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

## 任务
### Phase 1：历史任务
- [ ] 新增 packages/wuh.site.next/CODE_STYLE.md
- [ ] 包含文件长度、注释、样式组织三个约定
- [ ] 按板块拆为 post-content.ts、post-toolbar.ts、post-toc.ts
- [ ] 在 index.ts 统一 re-export
- [ ] 更新所有引用路径
- [ ] 样式拆到 HomeView.styles.ts
- [ ] 子组件拆到 components/
- [ ] 补充 JSDoc
- [ ] 样式拆到 blog/styles/index.ts
- [ ] 补充 JSDoc
- [ ] 样式拆到 SiteHeader/styles/index.ts
- [ ] 补充 JSDoc

## 结果
- 状态：approved
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: code-style-standards
date: 2026-06-07
type: P
status: approved
```

### `design.md`
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

### `proposal.md`
# 代码风格约定

统一 Next.js 项目的代码风格，包括文件长度限制、注释规范和样式文件组织。

## 背景

当前项目存在以下问题：
- 4 个文件超过 300 行，其中 post/styles/index.ts 高达 1102 行
- 91% 的文件零 JSDoc 注释
- 样式组织不统一：app 层大部分页面样式和组件逻辑混在同一文件

## 改动范围

- 新增 CODE_STYLE.md 规范文件
- 拆分 4 个超 300 行的文件
- 为整改文件补充 JSDoc 和关键逻辑注释

### `tasks.md`
# 任务清单

## Task 1: 创建规范文件
- [ ] 新增 packages/wuh.site.next/CODE_STYLE.md
- [ ] 包含文件长度、注释、样式组织三个约定

## Task 2: 拆分 app/post/styles/index.ts
- [ ] 按板块拆为 post-content.ts、post-toolbar.ts、post-toc.ts
- [ ] 在 index.ts 统一 re-export
- [ ] 更新所有引用路径

## Task 3: 拆分 app/HomeView.tsx
- [ ] 样式拆到 HomeView.styles.ts
- [ ] 子组件拆到 components/
- [ ] 补充 JSDoc

## Task 4: 拆分 app/blog/BlogListView.tsx
- [ ] 样式拆到 blog/styles/index.ts
- [ ] 补充 JSDoc

## Task 5: 拆分 app/components/SiteHeader.tsx
- [ ] 样式拆到 SiteHeader/styles/index.ts
- [ ] 补充 JSDoc
