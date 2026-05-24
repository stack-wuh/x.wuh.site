# Stage 1: base
FROM docker.m.daocloud.io/library/node:20-alpine AS base
RUN npm install -g pnpm@9.15.0 --registry=https://registry.npmmirror.com \
  && pnpm config set registry https://registry.npmmirror.com \
  && apk add --no-cache curl
WORKDIR /app

# Stage 2: deps — full install for building
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/wuh.site.next/package.json packages/wuh.site.next/
COPY packages/wuh.site.nest/package.json packages/wuh.site.nest/
COPY packages/components/package.json packages/components/
COPY packages/config/package.json packages/config/
COPY packages/shared-contracts/package.json packages/shared-contracts/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,id=pnpm-store \
  pnpm install --no-frozen-lockfile
COPY packages/ ./packages/

# Stage 3: builder-next
FROM deps AS builder-next
RUN --mount=type=cache,target=/app/packages/wuh.site.next/.next/cache \
  pnpm run build:next

# Stage 4: builder-nest
FROM deps AS builder-nest
RUN pnpm run build:nest

# Stage 5: deploy-next — extract minimal production deps for next only
FROM deps AS deploy-next
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,id=pnpm-store \
  pnpm --filter @wuh.site/next deploy --prod /tmp/deploy-next

# Stage 6: deploy-nest — extract minimal production deps for nest only
FROM deps AS deploy-nest
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,id=pnpm-store \
  pnpm --filter @wuh.site/nest deploy --prod /tmp/deploy-nest

# Stage 7: runner-next
FROM base AS runner-next
# Next.js standalone output — 构建时已自动分析运行时依赖，只保留必要文件
# monorepo 中 standalone 保持 packages/<name>/ 目录结构，server.js 在包目录下
COPY --from=builder-next /app/packages/wuh.site.next/dist/wuh.site.next/standalone ./
# Static client assets（相对 server.js 所在目录）
COPY --from=builder-next /app/packages/wuh.site.next/dist/wuh.site.next/static ./packages/wuh.site.next/.next/static
COPY --from=builder-next /app/packages/wuh.site.next/public ./packages/wuh.site.next/public
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1
CMD ["node", "packages/wuh.site.next/server.js"]

# Stage 8: runner-nest
FROM base AS runner-nest
# Minimal node_modules（仅 nest 的生产依赖，不含 next 系的依赖）
COPY --from=deploy-nest /tmp/deploy-nest/node_modules ./node_modules
# NestJS 编译产物
COPY --from=builder-nest /app/packages/wuh.site.nest/dist ./dist
COPY package.json ./
EXPOSE 3200
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3200/v2/health || exit 1
CMD ["node", "dist/main"]
