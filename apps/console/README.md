# @wuh.site/console

独立后台 Console，使用 Vite + React + TypeScript 实现。

## 权限模型

- GitHub 用户 `stack-wuh`：Root 权限，可执行后台写操作。
- 其他所有 GitHub 用户：自动 Read 权限，只能查看后台数据。
- 前端会隐藏或禁用写操作；真正的写权限由 NestJS `RootGuard` 强制校验。

## 本地开发

1. 在 GitHub OAuth App 中配置 callback：

```text
http://localhost:3200/v2/auth/github/callback
```

2. 复制根目录 `.env.example` 到 `.env.local` 或 `.env`，填写：

```text
GITHUB_OAUTH_CLIENT_ID=
GITHUB_OAUTH_CLIENT_SECRET=
GITHUB_OAUTH_CALLBACK_URL=http://localhost:3200/v2/auth/github/callback
CONSOLE_URL=http://localhost:3300
VITE_API_BASE_URL=http://localhost:3200/v2
JWT_SECRET=replace-with-a-long-random-secret
```

3. 启动服务：

```bash
pnpm dev:nest
pnpm dev:console
```

Console 默认运行在 `http://localhost:3300`。

## 构建

```bash
pnpm build:console
```

如果本机 Node 22 出现 pnpm/Jest 退出崩溃，建议切换到 Node 20 LTS 后再运行验证命令。
