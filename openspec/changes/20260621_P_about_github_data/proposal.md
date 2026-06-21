# About 页接入 GitHub 真实数据

## 为什么做

About 页"关于我"区块的个人（头像、姓名、Bio、Tags）、平台、联系、指标数据全部硬编码在 `data.ts` 中，头像用字母替代、指标是假数据。项目已有 `stack-wuh` 的 GitHub Personal Token，`ReposService` 已用 Octokit 调 GitHub API，可在最小改动下接入真实数据。

## 做什么

- 后端新增 `GET /repos/profile` 端点，复用 ReposService 已有 Octokit 实例获取 GitHub 用户信息
- 前端 About 页拆为 Server Component（fetch 数据）+ Client Component（渲染），遵循首页 `page.tsx → HomeView.tsx` 模式
- 个人区：GitHub 真实头像、姓名、简介
- Tags：博客 labels 按频率 ≥ 3 过滤，6 个技术标签
- 平台区：GitHub 卡片注入 `public_repos` + `followers` 真实数据
- 指标行：替换为基于 43 篇博客内容的客观个人简介

## 覆盖范围

- `packages/wuh.site.nest/src/modules/repos/` — 新增 DTO + service 方法 + controller 端点
- `packages/shared-contracts/src/` — 注册端点 + 新增 `GitHubProfileDto` 类型
- `packages/wuh.site.next/app/about/` — page.tsx 重写、新增 AboutView.tsx、data.ts 瘦身

## 不改什么

- styles.ts 不变
- 热力图和时间线区块不变（仍用 mock 数据）
- 语雀、微信公众号平台卡片保留静态描述
- 不新增 npm 依赖

## 影响范围

| 操作 | 文件 |
|------|------|
| 新建 | `packages/wuh.site.nest/src/modules/repos/dto/profile.dto.ts` |
| 修改 | `packages/wuh.site.nest/src/modules/repos/repos.service.ts` |
| 修改 | `packages/wuh.site.nest/src/modules/repos/repos.controller.ts` |
| 修改 | `packages/shared-contracts/src/endpoints.ts` |
| 修改 | `packages/shared-contracts/src/index.ts` |
| 修改 | `packages/wuh.site.next/app/about/data.ts` |
| 新建 | `packages/wuh.site.next/app/about/AboutView.tsx` |
| 重写 | `packages/wuh.site.next/app/about/page.tsx` |
