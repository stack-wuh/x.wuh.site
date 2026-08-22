# 修复 i.pravatar.cc 图片 host 未配置

## 动机

文章评论区乐观评论使用 `https://i.pravatar.cc/150?u=...` 作为头像，但 `apps/site/next.config.ts` 的 `images.remotePatterns` 未配置该 hostname，导致 `next/image` 渲染时报错：

```
Error: Invalid src prop (https://i.pravatar.cc/150?u=...) on `next/image`,
hostname "i.pravatar.cc" is not configured under images in your `next.config.js`
```

错误被 ErrorBoundary 捕获，评论区渲染异常。

## 引用规范

- 无直接命中的 active Knowledge（build-config.md 约束「构建和部署保持配置一致」不冲突）

## 决策

- **选型:** 在 `apps/site/next.config.ts` 的 `images.remotePatterns` 增加 `i.pravatar.cc`（`https`）
- **理由:** 与现有 remotePatterns 模式一致（weread/myqcloud/githubusercontent），最小改动修复

## 任务

### Phase 1: 配置修复

- [x] 修改 `apps/site/next.config.ts` — remotePatterns 增加 `i.pravatar.cc`
- [x] 验证: `tsc` 通过；配置检查确认 `i.pravatar.cc` 已包含且原配置保留

## 结果

- 实际耗时: ~10min
- 验证: 配置断言 PASS + tsc 通过

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 图片 host 配置属于一次性环境配置，不构成长期执行事实（若后续积累多个 host 配置模式再评估）
