# Spec: 构建配置

## ADDED

### Requirement: Production server API fallback uses Docker service name
- **GIVEN** Next.js 服务运行在生产环境且未显式配置 `NEST_API_URL`
- **WHEN** Server Component 或 Route Handler 通过共享 service 请求 Nest API
- **THEN** 默认 API base 应为 `http://nest:3200/v2`

---

## MODIFIED

### Requirement: None
- 本次不修改既有构建配置需求。

---

## REMOVED

### Requirement: None
- 本次不移除既有构建配置需求。
