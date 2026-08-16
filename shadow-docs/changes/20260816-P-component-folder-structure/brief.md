# 组件文件夹结构规范

> 状态：设计已确认，待实施

## 动机

当前页面结构拆分只覆盖了一部分业务页面，但页面使用的业务组件和组件库组件仍存在组织方式不统一的问题：部分组件是单文件，部分样式散落在组件外部，类型、测试和使用说明缺少稳定位置。随着页面继续拆分，如果组件层不建立同样的结构边界，页面入口虽然变短，但复杂度会继续堆到组件文件里。

## 目标

- 为业务组件和组件库组件建立统一的组件文件夹结构。
- 每个 UI 组件都由独立目录管理，目录内包含主代码、样式、规格/类型、测试和使用说明。
- 业务页面拆出的本地组件与 `packages/components` 组件库遵循同一结构原则。
- 新增组件必须直接使用该结构；既有组件按优先级分阶段迁移。
- 组件目录应让使用者不读内部实现也能找到入口、Props、样式、测试和示例说明。

## 非目标

- 不一次性迁移所有组件。
- 不重写组件视觉设计、交互行为或公共 API。
- 不把 hooks、主题 token、纯工具函数、常量文件强行套入组件目录。
- 不为本次规范迁移引入新测试框架或文档站。
- 不在提案阶段修改代码。

## 决策

### 1. 标准目录结构

每个可被 UI 使用的组件必须使用独立文件夹：

```text
ComponentName/
├── index.tsx        # 主代码 / 对外出口
├── styles/
│   └── index.tsx    # 样式总出口
├── specs.tsx        # Props、类型、静态规格
├── index.test.tsx   # 测试
└── README.md        # 使用说明
```

对于已经位于包名目录下的组件库组件，例如 `packages/components/button/`，目录名可以保持小写包名，但目录内部职责必须一致：

```text
button/
├── index.tsx
├── styles/index.tsx
├── specs.tsx
├── index.test.tsx
└── README.md
```

### 2. 文件职责

- `index.tsx`：组件主实现与对外出口，只保留组件组合、渲染逻辑和必要事件处理。
- `styles/index.tsx`：styled-components 样式总出口；样式复杂时可继续拆成 `styles/*.tsx` 并从 `styles/index.tsx` 聚合。
- `specs.tsx`：Props、组件本地类型、静态规格、选项数组、展示配置。
- `index.test.tsx`：组件行为或渲染测试；没有测试框架覆盖时，迁移任务必须记录缺口，不用空测试占位。
- `README.md`：组件用途、最小用法、关键 Props、注意事项；保持短文档，不写实现过程。

### 3. 适用边界

适用：

- `packages/wuh.site.next/app/**/components/*`
- 页面旁边拆出的业务组件，例如 `BlogListView`、`WereadView`、`GuestbookPageView` 等。
- `packages/components/*` 下可直接被 UI 使用的组件。

不适用：

- hooks、纯工具函数、主题 token、API 封装、数据转换函数。
- 图标集合内部的单个 fallback 图标，除非它们升级为独立公开组件。
- 只有一个职责清晰的内部辅助文件，且不作为组件对外使用的模块。

### 4. 迁移策略

采用分阶段迁移：

1. 新增组件立即使用标准目录结构。
2. 优先迁移业务页面直接使用且当前混杂明显的组件。
3. 组件库按触达优先级迁移：被业务页面使用、近期修改频繁、样式/类型混杂严重的组件先迁移。
4. 已经结构清晰但缺少 README 或测试的组件，优先补齐缺口，不做无意义重写。
5. 每次迁移保持组件 API 和页面行为不变。

## 影响范围

- `packages/wuh.site.next/app/**` — 业务页面本地组件与页面旁组件。
- `packages/components/**` — UI 组件库。
- `shadow-docs/knowledge/` — review/ship 阶段如确认该规范长期有效，应新增或更新组件结构 Knowledge。

## 任务

### Phase 1：盘点组件结构

- [ ] 扫描 `packages/wuh.site.next/app` 与 `packages/components` 下可被 UI 使用的组件。
- [ ] 标记单文件组件、样式外置但无独立目录、缺少 specs、缺少测试、缺少 README 的组件。
- [ ] 按“业务触达频率、混杂程度、迁移风险”确定首批迁移清单。
- [ ] 验证：输出首批组件清单与每个组件缺失项。

### Phase 2：迁移首批业务组件

- [ ] 将首批业务组件迁移到独立文件夹。
- [ ] 抽离样式到 `styles/index.tsx`。
- [ ] 抽离 Props、本地类型和静态规格到 `specs.tsx`。
- [ ] 补齐 `README.md`。
- [ ] 根据现有测试能力补齐 `index.test.tsx`；若缺少测试框架，记录缺口而不是创建空测试。
- [ ] 验证：页面引用路径、渲染行为和交互保持一致。

### Phase 3：迁移首批组件库组件

- [ ] 选择首批被业务页面直接依赖或当前混杂明显的 `packages/components` 组件。
- [ ] 按标准目录拆分主代码、样式、规格、测试和 README。
- [ ] 保持原导入路径兼容，例如 `@wuh.site/components/button` 不变。
- [ ] 验证：组件库导出、页面构建和引用路径正常。

### Phase 4：沉淀长期约束

- [ ] 如 review 确认该结构长期有效，新增或更新 `shadow-docs/knowledge/components.md` 或相关组件结构 Knowledge。
- [ ] 将该变更加入 `shadow-docs/INDEX.md`。
- [ ] 验证：`shadow-docs/menu.md` 能通过组件、样式、测试、README、结构拆分等关键词路由到对应 Knowledge。

## 验收标准

- [ ] 新增或迁移的 UI 组件都位于独立组件文件夹。
- [ ] 组件主代码、样式、规格/类型、测试和 README 有明确位置。
- [ ] 样式通过 `styles/index.tsx` 统一导出。
- [ ] Props、本地类型和静态规格位于 `specs.tsx`。
- [ ] README 说明组件用途、最小用法和关键 Props。
- [ ] 不改变现有组件 API、页面 URL、视觉结果和交互行为。
- [ ] 类型检查通过。
- [ ] 涉及可视组件时，浏览器预览确认相关页面正常渲染。

## 知识影响预期

预计需要更新或新增组件结构相关 active Knowledge，用于长期约束业务组件与组件库组件的目录职责边界。