# 任务拆分

## Phase 1 — Next.js 前端 (无依赖，可并行)

- [x] T1: `packages/wuh.site.next/package.json` — 安装 oxlint，移除 eslint/eslint-config-next，替换脚本
- [x] T2: 新建 `packages/wuh.site.next/.oxlintrc.json`
- [x] T3: 删除 `packages/wuh.site.next/eslint.config.mjs`

## Phase 2 — 根 + Nest 清理 (无依赖，可并行)

- [x] T4: 根 `package.json` — 移除 eslint/eslint-config-next/@typescript-eslint/* 根依赖
- [x] T5: `packages/wuh.site.nest/package.json` — 移除无效的 eslint 依赖和 lint 脚本

## Phase 3 — 验证

- [x] T6: 运行 `oxlint app` — 53ms 检查 38 文件，7w 0e ✅
