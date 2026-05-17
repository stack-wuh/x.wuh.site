# Stage 1: base
FROM docker.m.daocloud.io/library/node:20-alpine AS base
RUN npm install -g pnpm@9.15.0 --registry=https://registry.npmmirror.com \
  && pnpm config set registry https://registry.npmmirror.com \
  && apk add --no-cache curl
WORKDIR /app

# Stage 2: deps — package.json first, install, then source
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/wuh.site.next/package.json packages/wuh.site.next/
COPY packages/wuh.site.nest/package.json packages/wuh.site.nest/
COPY packages/components/package.json packages/components/
COPY packages/config/package.json packages/config/
COPY packages/shared-contracts/package.json packages/shared-contracts/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --no-frozen-lockfile
COPY packages/ ./packages/

# Stage 3: builder-next (incremental build with .next/cache)
FROM deps AS builder-next
RUN --mount=type=cache,target=/app/packages/wuh.site.next/.next/cache \
  pnpm run build:next

# Stage 4: builder-nest
FROM deps AS builder-nest
RUN pnpm run build:nest

# Stage 5: runner-next
FROM base AS runner-next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=builder-next /app/packages/wuh.site.next/dist ./packages/wuh.site.next/dist
COPY package.json pnpm-workspace.yaml ./
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1
CMD ["pnpm", "run", "start:next"]

# Stage 6: runner-nest
FROM base AS runner-nest
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=builder-nest /app/packages/wuh.site.nest/dist ./packages/wuh.site.nest/dist
COPY package.json pnpm-workspace.yaml ./
EXPOSE 3200
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3200/v2/health || exit 1
CMD ["node", "packages/wuh.site.nest/dist/main"]
