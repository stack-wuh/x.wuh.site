# 任务清单

## Phase 1: 后端数据与契约

### Task 1: 定义站点活动共享 DTO

- [x] **文件:** `packages/shared-contracts/src/about-activity.dto.ts`, `packages/shared-contracts/src/endpoints.ts`, `packages/shared-contracts/src/index.ts`
- [x] 定义 365 天响应、每日 breakdown、分类等级和日期范围字段。
- [x] 保持日期格式、等级范围和接口路径一致。
- [ ] **预计耗时:** 45 分钟；**实际耗时:** 待实施
- [ ] **验证:** `pnpm exec tsc --noEmit`

### Task 2: 实现访问记录逐日聚合

- [x] **文件:** `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.service.ts`, `packages/wuh.site.nest/src/modules/visit-stats/visit-stats.controller.ts`
- [x] 增加供 About 聚合模块调用的日期范围聚合能力，不改变现有 total/today 响应。
- [x] 使用站点时区生成日期边界并按日返回计数。
- [ ] **预计耗时:** 75 分钟；**实际耗时:** 待实施
- [ ] **验证:** 相关服务测试及接口响应检查

### Task 3: 实现 About 综合活动聚合模块

- [x] **文件:** `packages/wuh.site.nest/src/modules/about-activity/`
- [x] 汇总访问、文章发布、文章更新、评论/留言；项目更新暂不伪造，待稳定数据源后接入。
- [x] 补齐 365 天日期、独立归一化分类等级并计算等权综合等级。
- [x] 任一数据源失败时记录来源并返回明确错误，不返回部分成功结果。
- [ ] **预计耗时:** 2 小时；**实际耗时:** 待实施
- [ ] **验证:** 聚合服务测试覆盖空日期、跨时区、等级边界和单源失败

### Task 4: 注册接口并接入模块

- [x] **文件:** `packages/wuh.site.nest/src/modules/about-activity/about-activity.controller.ts`, `packages/wuh.site.nest/src/app.module.ts`
- [x] 实现 `GET /v2/about/activity`，返回共享 DTO。
- [x] 配置现有 API 前缀、异常处理和日志风格。
- [ ] **预计耗时:** 45 分钟；**实际耗时:** 待实施
- [ ] **验证:** Nest 构建和接口集成测试

## Phase 2: 前端热力图展示

### Task 5: 扩展 Heatmap 通用展示能力

- [x] **文件:** `packages/components/heatmap/types.ts`, `packages/components/heatmap/index.tsx`
- [x] 支持站点活动数据、活动文案、分类 breakdown 和移动端点击选中。
- [x] 保持 GitHub 热力图调用方和现有 tooltip 行为兼容。
- [ ] **预计耗时:** 2 小时；**实际耗时:** 待实施
- [ ] **验证:** 组件类型检查及已有 Heatmap 使用点检查

### Task 6: 接入 About 站点活动接口

- [x] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`, `packages/wuh.site.next/app/about/data.ts`
- [x] 请求站点活动接口并渲染独立热力图。
- [x] 增加加载、失败和无数据状态；GitHub 热力图保持独立。
- [x] 不再把静态日志当作真实活动数据。
- [ ] **预计耗时:** 90 分钟；**实际耗时:** 待实施
- [ ] **验证:** `pnpm lint:next`、`pnpm exec tsc --noEmit`

## Phase 3: 规范与验收

### Task 7: 补充访问统计和 About 活动规范

- [ ] **文件:** `openspec/specs/about-activity/spec.md`, `openspec/specs/visit-stats/spec.md`, `openspec/INDEX.md`
- [ ] 记录新增接口、365 天日期窗口、来源失败、等级计算和交互要求。
- [ ] 明确 visit-stats 原有 total/today 接口不被破坏。
- [ ] **预计耗时:** 45 分钟；**实际耗时:** 待实施
- [ ] **验证:** OpenSpec 文档自检，所有 Requirement 使用 GIVEN/WHEN/THEN

## 验收

- [ ] About 页面展示独立的站点活动热力图和 GitHub contribution 热力图。
- [ ] 接口始终返回 365 个日期，缺失日期补零，并包含分类明细。
- [ ] 任一数据源失败时前端显示失败状态，不能展示伪完整数据。
- [ ] 桌面端 hover、移动端 click 均能查看日期、等级和分类明细。
- [ ] `pnpm exec tsc --noEmit` 零错误。
- [ ] `pnpm lint:next` 通过。
