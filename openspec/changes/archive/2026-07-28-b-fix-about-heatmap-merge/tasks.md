# 任务清单

## Phase 1: 复现与契约测试

### Task 1: 固化代理路径与统一响应的失败用例

- [x] **文件:** 现有 About 活动服务/控制器测试文件，必要时使用现有测试目录
- [x] 添加浏览器路径 `/api/about/activity` 经 rewrite 只生成一个 `/v2` 前缀的测试或可重复验证脚本。
- [x] 添加统一 365 天响应中包含 GitHub 贡献、站点分类、每日总量和等级的失败用例。
- [ ] **预计:** 30 分钟
- [ ] **验证:** 修复前代理路径或统一响应断言失败，且失败原因符合预期。

## Phase 2: 后端统一聚合

### Task 2: 合并 GitHub 与站点日活动

- [x] **文件:** `packages/wuh.site.nest/src/modules/about-activity/about-activity.service.ts`
- [x] 复用 GitHub contribution 数据源，按 Asia/Shanghai 日期键与站点活动合并。
- [x] 以所有原始分类计数之和计算每日 `total`，并基于统一总量分布计算 `level`。
- [x] 保持 365 天日期完整；必要数据源失败时返回明确错误。
- [ ] **预计:** 60 分钟
- [ ] **验证:** 服务测试覆盖同日合并、不同日补零、无活动日等级为 0 和 GitHub 数据源失败。

### Task 3: 更新共享响应契约

- [x] **文件:** `packages/shared-contracts/src/about-activity.dto.ts`、相关导出文件
- [x] 将 GitHub 贡献分项和统一总量/等级纳入共享 DTO。
- [ ] **预计:** 20 分钟
- [ ] **验证:** 前后端类型检查能消费统一响应。

## Phase 3: 前端单图渲染

### Task 4: 修复请求路径并移除双热力图

- [ ] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`
- [ ] 将请求改为 `/api/about/activity`，避免 rewrite 产生 `/v2/v2`。
- [ ] 用一次 `useRequest` 和一次 `Heatmap` 渲染替换两套独立请求与热力图。
- [ ] 保留每日总量和站点/GitHub 分项的交互详情，失败时只显示一个错误状态。
- [ ] **预计:** 40 分钟
- [ ] **验证:** About 视图不再请求 `/api/v2/*` 或 `/v2/*` 热力图路径，且只渲染一个 `Heatmap`。

### Task 5: 适配统一热力图详情

- [ ] **文件:** `packages/components/heatmap/index.tsx` 及其既有类型文件（如需要）
- [ ] 显示 GitHub 贡献和站点分类明细，避免固定“GitHub 贡献”或“站点活动”的单源文案。
- [ ] **预计:** 30 分钟
- [ ] **验证:** 单元格 hover/click/focus 均显示日期、总量、GitHub 贡献与站点分类。

## Phase 4: 集成验证

### Task 6: 验证真实代理链路与页面

- [ ] **文件:** 无生产文件修改
- [ ] 启动 NestJS 和 Next.js，验证 `GET /api/about/activity` 成功返回统一响应，且不存在 `/v2/v2` 请求。
- [ ] 在桌面和移动视图检查 About 页面仅有一个热力图，数据与 tooltip 正常展示。
- [ ] **预计:** 30 分钟
- [ ] **验证:** 相关测试、lint 和类型检查全部通过；浏览器控制台无热力图请求错误。

## 验收

- [ ] `GET /api/about/activity` 通过 Next rewrite 正确到达 `GET /v2/about/activity`，不出现双 `/v2` 前缀。
- [ ] About 页面只展示一个最近 365 天的综合热力图。
- [ ] 每日格子强度由站点活动与 GitHub 贡献的原始总量决定。
- [ ] Tooltip/移动端详情包含总活动量、GitHub 贡献和站点活动分类。
- [ ] 任一必要数据源失败时页面显示唯一明确错误状态，不能显示伪完整数据。
- [ ] 相关测试、lint、TypeScript 类型检查和真实页面链路验证通过。
