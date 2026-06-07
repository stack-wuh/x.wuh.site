# 任务清单

## Task 1: docker-compose.yml 端口环境变量化
- [ ] `next` 端口改为 `"${PORT_NEXT:-3000}:3000"`
- [ ] `nest` 端口改为 `"${PORT_NEST:-3200}:3200"`

## Task 2: deploy-docker.sh 新增 deploy 命令
- [ ] 新增 `deploy` case：构建 → tag → staging up → health check → 切换/回滚
- [ ] `restart` 命令改为调用 `deploy`
- [ ] 保留 `prune_old_images` 函数不变

## Task 3: ci-cd.yml 更新部署命令
- [ ] script 中 `restart` 改为 `deploy`
