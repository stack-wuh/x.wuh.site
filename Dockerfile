# 第一阶段：基础环境
FROM node:20-alpine AS base
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
  && corepack prepare pnpm@9.15.0 --activate \
  && pnpm config set registry https://registry.npmmirror.com \
  && apk add --no-cache curl
WORKDIR /app

# 第二阶段：安装依赖
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages packages
RUN pnpm install --no-frozen-lockfile

# 第三阶段：构建应用
FROM deps AS builder
RUN pnpm run build:next

# 第四阶段：生产环境依赖
FROM deps AS prod-deps
RUN pnpm install --prod --filter @wuh.site/next

# 最终阶段：运行时环境
FROM base AS runner
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/packages/wuh.site.next/dist/wuh.site.next ./packages/wuh.site.next/dist/wuh.site.next
COPY --from=builder /app/packages/wuh.site.next ./packages/wuh.site.next
COPY package.json pnpm-workspace.yaml ./
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD sh -c 'curl -f http://localhost:3000/_next/healthz || curl -f http://localhost:3000/ || exit 1'
CMD ["pnpm", "run", "start:next"]