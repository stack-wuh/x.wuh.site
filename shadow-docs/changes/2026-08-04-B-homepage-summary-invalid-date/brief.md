# 修复首页年度总结显示 Invalid Date

> 类型：Bug
> 日期：2026-08-04
> Issue：未创建

## 动机

首页的“年度总结”模块出现 `Invalid Date`，影响用户判断文章发布时间。用户反馈最初指向首页微信读书模块，但只读调查和生产复现确认：当前可见的 `Invalid Date` 实际位于“年度总结”模块；首页微信读书模块不展示时间，`/weread` 页面中的阅读时间可正常显示。

## 根因证据

1. `GET /api/content/posts?limit=50&state=open` 返回内容项使用后端字段 `createdAtGitHub`。
2. 共享契约 `ContentItem` 也声明日期字段为 `createdAtGitHub`，而不是 `created_at`。
3. 首页 `HomeView` 将年度总结响应直接断言为 `PostListItem[]`，没有执行字段映射。
4. 年度总结渲染读取 `item.created_at` 并传给 `new Date()`；该字段不存在时值为 `undefined`，因此浏览器显示 `Invalid Date`。
5. 生产复现：访问 `https://wuh.site/`，页面“年度总结”中的 `2022年度总结`、`2021年度总结`均显示 `Invalid Date`。
6. 微信读书数据链路返回数值型 Unix 秒级时间戳 `readUpdateTime`；`/weread` 页面使用 `new Date(book.readUpdateTime * 1000)`，当前线上数据可正常显示日期。

## 影响范围

- **受影响:** 首页“年度总结”模块的日期展示；当前线上至少两条年度总结记录受影响。
- **不受影响:** 首页微信读书模块的书籍列表与在读筛选；`/weread` 页面阅读时间展示。
- **接口:** 无需修改后端 API 或共享 DTO。
- **数据:** 无需迁移数据库；问题是前端字段契约映射缺失。

## 决策

### 推荐方案：修正数据映射

在年度总结数据进入首页视图模型时，将 `ContentItem.createdAtGitHub` 映射为 `PostListItem.created_at`，保持现有 `HomeView` 渲染逻辑和日期格式不变。

选择理由：

- 修复根因，即 API DTO 与视图模型之间缺少适配，而不是在渲染层掩盖字段不一致。
- 改动范围最小，不改变后端接口、共享契约和其他页面行为。
- 与首页精选博客已有的 `mapContentToPost` 适配方式一致。

### 备选方案

- **渲染层兼容双字段:** 在 `HomeView` 中读取 `createdAtGitHub` / `created_at`。容错更强，但会把 API DTO 与视图模型的不一致继续带入组件层。
- **统一日期适配层:** 抽取全站日期适配和格式化逻辑。适合更大范围日期治理，但超出本次单点 Bug，增加变更面。

## 任务

### Phase 1：前端字段映射

- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`
- [ ] 将年度总结 API 响应的 `ContentItem` 数据映射为 `PostListItem`，确保 `created_at` 来源于 `createdAtGitHub`。
- [ ] 保持现有年度总结筛选条件（标题包含“年度总结”）和最多展示 3 条的行为。
- [ ] **预计耗时:** 0.25h

### Phase 2：验证

- [ ] 为年度总结数据准备能复现 `createdAtGitHub` 输入的验证用例；确认修复前失败、修复后显示有效日期。
- [ ] 访问首页确认不再出现 `Invalid Date`，且年度总结日期与 API 的 `createdAtGitHub` 一致。
- [ ] 运行前端相关 lint、类型检查和已有测试。
- [ ] 确认首页微信读书模块与 `/weread` 页面时间展示无回归。

## 验收标准

- [ ] 首页“年度总结”模块不再出现 `Invalid Date`。
- [ ] 每条年度总结显示其 `createdAtGitHub` 对应的中文月日格式。
- [ ] 当年度总结为空时，现有空状态行为保持不变。
- [ ] 首页精选博客、微信读书模块和 `/weread` 页面行为保持不变。
- [ ] 前端 lint、类型检查及相关测试通过。

## 非目标

- 不修改微信读书 `readUpdateTime` 的数据格式、排序或同步逻辑。
- 不修改后端内容接口和共享 DTO 字段命名。
- 不重构全站日期格式化体系。
- 不调整首页视觉布局或年度总结文案。
