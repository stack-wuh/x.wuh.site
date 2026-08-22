# 前端页面结构拆分规范

> 状态：设计已确认，待实施

## 动机

前端页面存在样式定义、业务逻辑、泛型/类型说明混合在同一个业务入口文件中的情况，导致页面文件过长、职责边界不清晰，后续修改时需要在一个文件里同时理解路由、数据获取、渲染结构、样式细节和类型约束。

当前项目已经有局部拆分实践，例如首页已有 `styles/index.ts`，博客详情页已有 `post/styles/*`，About 页面已有“入口只负责组合”的 active Knowledge。但这些实践尚未形成适用于所有前端页面的统一结构规则。

## 目标

- 为 `packages/wuh.site.next/app` 下所有前端页面建立统一的文件组织规范。
- 保留 Next.js App Router 的 `page.tsx` 路由入口约定。
- 页面入口只负责路由层组合、数据获取编排和顶层渲染，不承载大段样式和类型说明。
- 样式统一放入同级 `styles/*`，并通过 `styles/index.tsx` 作为样式总出口。
- 泛型、类型说明、静态规格和页面内部类型统一放入同级 `specs.tsx`。
- 本次实施优先迁移问题最明显、收益最高的页面，后续新增或修改页面按规范增量遵守。

## 非目标

- 不一次性强制迁移所有页面。
- 不改变现有路由 URL、页面功能、数据接口或视觉设计。
- 不引入新样式方案，不替换 styled-components。
- 不为了抽离而拆分非常短且职责已经清晰的文件。
- 不生成测试文件。

## 已引用 Knowledge

- `shadow-docs/knowledge/about-code-structure.md`
  - 当前结论：About 页面 `page.tsx` 控制在 80 行以内，每个文件职责单一。
  - 适用 scope：`packages/wuh.site.next/app/about`
  - 对本次影响：将 About 的“入口只负责组合”扩展为前端页面通用组织原则，但不把 About 的 80 行硬上限直接推广到全部页面。

## 决策

### 1. 页面目录结构

保留 Next.js App Router 入口文件命名：

```text
app/<route>/
├── page.tsx          # 路由入口：数据获取、元信息、页面组合
├── specs.tsx         # 页面内部类型、泛型说明、静态规格
└── styles/
    ├── index.tsx     # 样式总出口
    └── *.tsx         # 按区域或组件拆分的 styled-components
```

根首页位于 `app/page.tsx` 时，继续使用 `app/styles/index.tsx`，如需要更多拆分则放入 `app/styles/*`。

### 2. 文件职责

- `page.tsx`
  - 保留 `metadata`、`dynamic`、服务端数据获取、页面顶层组合。
  - 可以保留少量只服务页面编排的转换逻辑。
  - 不放大段 styled-components。
  - 不放复杂类型声明、泛型解释或静态规格数组。

- `styles/index.tsx`
  - 汇总导出当前页面的 styled-components。
  - 样式较少时可以直接承载样式定义。
  - 样式较多时只作为总出口，从 `styles/*.tsx` 聚合导出。

- `styles/*.tsx`
  - 按页面区域、组件区域或视觉职责拆分。
  - 只包含样式定义和样式所需的轻量 props 类型。

- `specs.tsx`
  - 放页面内部类型、泛型说明、常量规格、配置数组、视图模型类型。
  - 如果某个类型已经属于跨包契约，仍放在 `@wuh.site/shared-contracts`，不复制到页面 specs。

### 3. 迁移策略

采用“规范 + 优先迁移”：

1. 先建立结构规范和验收标准。
2. 实施时优先迁移当前明显混杂或过长的前端页面。
3. 已经符合拆分原则的页面不做无意义改动。
4. 后续新增页面和触达页面按该规范增量遵守。

### 4. 命名规则

- 页面入口保持 `page.tsx`。
- 页面内部类型文件统一命名为 `specs.tsx`。
- 样式总出口统一命名为 `styles/index.tsx`。
- 复杂样式按语义拆分，例如 `styles/hero.tsx`、`styles/list.tsx`、`styles/layout.tsx`。

## 影响范围

- `packages/wuh.site.next/app/**/page.tsx` — 作为页面结构规范的主要适用范围。
- `packages/wuh.site.next/app/**/styles/*` — 统一样式拆分和出口方式。
- `packages/wuh.site.next/app/**/specs.tsx` — 新增页面内部类型和规格承载位置。
- `shadow-docs/knowledge/` — review/ship 阶段如确认该规范长期有效，应新增或更新前端代码结构 Knowledge。

## 任务

### Phase 1：盘点和确定优先迁移页面

- [ ] 扫描 `packages/wuh.site.next/app/**/page.tsx`，识别包含 styled-components、复杂类型声明、泛型说明或静态规格的页面。
- [ ] 按“文件长度、职责混杂程度、改动风险”选择优先迁移页面。
- [ ] 验证：列出候选页面及每个页面需要抽离到 `styles/*` 或 `specs.tsx` 的内容。

### Phase 2：迁移优先页面

- [ ] 对候选页面保留 `page.tsx` 路由入口。
- [ ] 将 styled-components 抽离到同级 `styles/index.tsx` 或 `styles/*.tsx`。
- [ ] 将页面内部类型、泛型说明、静态规格抽离到同级 `specs.tsx`。
- [ ] 清理迁移后不再需要的 import。
- [ ] 验证：页面功能、路由和视觉表现保持一致。

### Phase 3：建立长期约束

- [ ] 如果 review 确认该规则长期有效，新增或更新 `shadow-docs/knowledge/` 中的前端页面结构 Knowledge。
- [ ] 将本 brief 加入 `shadow-docs/INDEX.md`。
- [ ] 验证：Knowledge 路由能通过 `shadow-docs/menu.md` 精确命中该结构规则。

## 验收标准

- [ ] 被迁移页面的 `page.tsx` 不再包含大段 styled-components。
- [ ] 被迁移页面的页面内部类型、泛型说明和静态规格放入 `specs.tsx`。
- [ ] 被迁移页面的样式通过 `styles/index.tsx` 统一导出。
- [ ] Next.js App Router 路由入口仍为 `page.tsx`。
- [ ] 未改变页面 URL、数据请求、交互行为和视觉设计。
- [ ] `pnpm exec tsc --noEmit` 通过。
- [ ] 如涉及可视页面变更，使用浏览器预览确认页面正常渲染。

## 知识影响预期

预计需要新增一张 active Knowledge，主题为“前端页面代码结构”或“Next 页面结构拆分”，用于长期约束 `packages/wuh.site.next/app` 下页面入口、样式和 specs 的职责边界。
