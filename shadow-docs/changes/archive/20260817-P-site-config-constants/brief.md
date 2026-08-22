# 站点全局常量提取

> 状态：设计已确认，待实施

## 动机

站点级常量在多处重复定义：

- `SITE_URL = 'https://wuh.site'`：11 处（各页面 `specs.tsx`、`page.tsx`、`layout.tsx`、`lib/seo.ts`、`lib/structured-data.ts`、`lib/sitemap-utils.ts`，以及 nest 后端 `rss.service.ts`、`main.ts`）
- `siteName: 'wuh.site'`：9 处
- 作者名 `'吴尒红（Shadow）'`、站点标题 `'wuh.site · 朝朝如念'`、站点描述：多处重复

重复导致修改站点信息需改动十几个文件，且站点描述存在两个不一致版本，影响 SEO 一致性。

## 目标

- 在 `shared-contracts`（前后端共享包）中建立唯一的站点常量源。
- 集中定义 SITE_URL、SITE_NAME、SITE_TITLE、SITE_DESCRIPTION、AUTHOR_NAME、AUTHOR_URL。
- 重新设计站点描述，利于 SEO 检索。
- 替换前后端各处的重复定义，统一引用。
- 删除已无实际用途的 `packages/config`（`@wuh.site/types` 类型声明包）。

## 非目标

- 不把各页面独有的 title/description 强行集中（只提取全局相同的常量）。
- 不引入新的依赖或配置框架。

## 决策

### 1. 常量落点：shared-contracts

站点常量放 `packages/shared-contracts/src/site.ts`，因为：

- `shared-contracts` 是 next + nest + console 三端共享的包。
- 其 `endpoints.ts` 已经是运行时常量（`export const contentService = ...`），有先例。
- nest 的 RSS、next 的 metadata 都能直接引用。

### 2. 删除 packages/config

`packages/config`（`@wuh.site/types`）已无实际用途：

- `*.css` 声明：next 无任何 `.css` import（只有 `.scss`）。
- styled-components `DefaultTheme` 扩展：next 无任何 theme token 类型使用。
- `@wuh.site/types` / `@wuh.site/config`：无任何代码 import。

删除后需清理 `packages/wuh.site.next/tsconfig.json` 里的 `@wuh.site/config/*` paths 映射。

### 3. 常量结构

```ts
export const SITE_URL = 'https://wuh.site'
export const SITE_NAME = 'wuh.site'
export const SITE_TITLE = 'wuh.site · 朝朝如念'
export const SITE_DESCRIPTION = '吴尒红（Shadow）的个人技术博客与知识库，专注前端工程化、开源项目、设计系统与全栈开发，分享 Next.js、React、TypeScript、NestJS 等技术文章、项目实战与个人思考。'
export const AUTHOR_NAME = '吴尒红（Shadow）'
export const AUTHOR_URL = 'https://github.com/stack-wuh'
```

### 4. SEO 描述设计

统一为约 90 字、含核心关键词的描述，点明站点定位（个人技术博客 + 知识库）、覆盖领域关键词（前端工程化、开源项目、设计系统、全栈开发）和技术栈关键词（Next.js、React、TypeScript、NestJS）。

## 任务

### Phase 1：建立 shared-contracts 站点常量

- [ ] 新建 `packages/shared-contracts/src/site.ts`，写入 6 个常量。
- [ ] 在 `src/index.ts` 中 `export * from './site'`。
- [ ] 验证：可从 `@wuh.site/shared-contracts` 导入常量。

### Phase 2：删除 packages/config

- [ ] 删除 `packages/config` 目录。
- [ ] 清理 `packages/wuh.site.next/tsconfig.json` 的 `@wuh.site/config/*` paths 映射。
- [ ] 验证：`tsc` 通过，无残留引用。

### Phase 3：替换前后端 SITE_URL 等

- [ ] 替换 next 各页面/库中重复的 `SITE_URL`、`siteName`、站点标题/描述/作者名，改为引用 shared-contracts 常量。
- [ ] 替换 nest `rss.service.ts`、`main.ts` 中的站点常量。
- [ ] 验证：`rg "SITE_URL ="` 只剩 shared-contracts 一处定义。

## 验收标准

- [ ] `shared-contracts/src/site.ts` 是站点常量的唯一定义处。
- [ ] `packages/config` 已删除，无残留引用。
- [ ] 站点描述统一为利于 SEO 的版本。
- [ ] 各页面功能、路由和渲染行为不变。
- [ ] `tsc` 通过，浏览器预览各页面正常。

## 知识影响预期

无需新增 Knowledge；后续如确认站点常量结构稳定，可在 review 阶段评估是否记录。
