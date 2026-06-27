# 任务拆分

## Phase 1 — Docker 配置

- [ ] T1: 编写 Dockerfile（多阶段构建）
  - 涉及文件: `Dockerfile`
- [ ] T2: 添加 .dockerignore
  - 涉及文件: `.dockerignore`
- [ ] T3: 编写 docker-compose.yml
  - 涉及文件: `docker-compose.yml`

## Phase 2 — CI 集成

- [ ] T4: 更新 CI workflows 支持 Docker build + push
  - 涉及文件: `.github/workflows/`

## Phase 3 — 验证

- [ ] T5: 本地构建并测试
  - `docker build -t wuh.site . && docker run -p 3000:3000 wuh.site`
  - 验证健康检查、环境变量
