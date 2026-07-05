# 设计文档

## 架构

首页仍由 Server Component 获取数据，但不能在构建阶段把失败结果固化为静态 HTML。修复分两层：

1. `createService.ts` 使用和 `next.config.ts` 一致的 API base fallback：生产环境默认 `http://nest:3200/v2`，开发环境默认 `http://localhost:3200/v2`。
2. 首页声明 `dynamic = 'force-dynamic'`，确保数据在运行时获取，而不是构建时预渲染成空数据。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 渲染策略 | `force-dynamic` | 避免构建期 API 不可达时固化空数据 |
| API fallback | production 使用 `http://nest:3200/v2` | Docker compose 中 Next 访问 Nest 应使用服务名 |
| 错误诊断 | `console.error` 服务端日志 | 保持最小改动，便于定位线上空数据 |

## API 设计（如涉及）

不新增 API。

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无。
- **向后兼容:** 开发环境仍默认访问 `localhost:3200/v2`。
- **性能影响:** 首页从静态预渲染变为运行时渲染；各请求仍使用现有 revalidate 配置参与 Next fetch 缓存。
