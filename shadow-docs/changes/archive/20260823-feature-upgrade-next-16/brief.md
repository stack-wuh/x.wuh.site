# 升级 Next.js 15 → 16

## 动机

项目当前使用 Next.js 15.2.9，最新稳定版为 16.3.2。升级可获得：

- Turbopack 稳定版默认启用（更快的 dev/build）
- React 19.2（View Transitions、useEffectEvent、Activity）
- 路由与导航性能优化（布局去重、增量 prefetch）
- 持续获得 Next.js 安全与功能更新

## 引用规范

- `shadow-docs/knowledge/build-config.md`
  - 当前结论: 构建和部署必须保持 workspace 路径、健康检查、运行端口与环境变量一致
  - 适用 scope: Dockerfile、docker-compose.yml、`.github/workflows`、部署脚本
  - 本次影响: 升级可能改变 dist 输出路径与构建行为，需保证 Docker 构建与部署不回归
- `shadow-docs/knowledge/next.md`
  - 当前结论: 导入路径规范与 `@/*` 别名
  - 适用 scope: apps/site/tsconfig.json
  - 本次影响: 升级不应破坏现有导入路径
- `shadow-docs/knowledge/blog-scroll-behavior.md`
  - 当前结论: 滚动行为相关约束
  - 本次影响: Next 16 不再覆盖 `scroll-behavior`；项目未全局设置该属性，无影响

## 决策

- **选型:** 升级到 Next.js 16.3.2（最新稳定版），同步迁移已确认的破坏性变更
- **对比方案:**
  - 停留在 15.2.9：放弃新版本特性与更新，未选
  - 升级到 canary：不稳定，未选
- **理由:** 16 是当前稳定主线，项目暴露的破坏性变更有限且可控

### 需要迁移的破坏性变更（基于项目暴露面）

1. **middleware → proxy**：`apps/site/middleware.ts` 改名为 `proxy.ts`，导出函数改名（官方方向，已确认）
2. **Turbopack 默认**：`dev` script 移除 `--turbo`（16 默认启用）
3. **next/image 默认变更**（可接受，无需配置）：
   - `minimumCacheTTL` 60s → 4h
   - `imageSizes` 移除 16
   - `qualities` 默认 `[75]`
   - 项目未用 `quality` prop，远程图片为 avatar/封面，影响可接受

### 无需迁移项

- Async Request APIs：项目已用 `Promise<params>` / `await searchParams`（基本合规，验证时确认）
- revalidateTag 第二参数：项目未使用
- 并行路由 `default.js`：项目无并行路由
- scroll-behavior：项目未全局设置

## 任务

### Phase 1: 版本升级

- [ ] `apps/site/package.json` — next 升到 `16.3.2`，运行 `pnpm install`
- [ ] 运行 `next typegen` 与官方 codemod（如适用）处理机械迁移

### Phase 2: 破坏性变更迁移

- [ ] `apps/site/middleware.ts` → `proxy.ts`（导出函数同步改名）
- [ ] `apps/site/package.json` dev script 移除 `--turbo`

### Phase 3: 验证

- [x] `tsc` 通过（Next 16 下，`exit=0` 无错误）
- [x] 全量测试套件通过（96 pass / 0 fail）
- [ ] `next build` 成功 — 本地 Node 24.19.0 V8 崩溃（page data collection 阶段 SIGSEGV），交由 CI（Node 22）验证
- [ ] 浏览器预览 — 本地无法运行（环境崩溃），交由 CI 部署后验证

## 结果

- 实际耗时: ~40min（本地）
- 验证: `tsc` 通过（无错误）；测试套件 96/96 通过；本地 `next build` 与浏览器预览因 Node 24 V8 崩溃无法在本地完成（已确认是环境问题），构建与页面验证依赖 CI（GitHub Actions 使用 Node 22）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/next.md`、`shadow-docs/knowledge/build-config.md`
- **理由:** 升级后 Next 版本、Turbopack 默认、proxy 约定为长期事实，需同步卡片；待 review 确认
