# Stage 1: base
FROM docker.m.daocloud.io/library/node:20-alpine AS base
ENV CI=true
RUN npm install -g pnpm@10.23.0 --registry=https://registry.npmmirror.com \
  && apk add --no-cache curl
WORKDIR /app

# Stage 2: deps — full install for building
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.json tsconfig.base.json ./
COPY apps/site/package.json apps/site/
COPY apps/server/package.json apps/server/
COPY packages/components/package.json packages/components/
COPY packages/core/package.json packages/core/
COPY packages/hooks/package.json packages/hooks/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,id=pnpm-store \
  pnpm install --frozen-lockfile
COPY packages/ ./packages/
COPY apps/ ./apps/

# Stage 3: builder-next
FROM deps AS builder-next
RUN --mount=type=cache,target=/app/apps/site/.next/cache \
  pnpm run build:next

# Stage 4: builder-nest
FROM deps AS builder-nest
RUN pnpm run build:nest

# Stage 5: deps-pruned — strip devDependencies from full install (keeps workspace packages)
FROM deps AS deps-pruned
RUN pnpm prune --ignore-scripts

# Stage 6: runner-next
FROM base AS runner-next
COPY --from=deps-pruned /app/node_modules ./node_modules
COPY --from=deps-pruned /app/packages ./packages
COPY --from=deps-pruned /app/apps ./apps
COPY --from=builder-next /app/apps/site/dist ./apps/site/dist
COPY package.json pnpm-workspace.yaml ./
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:3000/ || exit 1
CMD ["pnpm", "run", "start:next"]

# Stage 7: runner-nest
FROM base AS runner-nest
COPY --from=deps-pruned /app/node_modules ./node_modules
COPY --from=deps-pruned /app/packages ./packages
COPY --from=deps-pruned /app/apps ./apps
COPY --from=builder-nest /app/apps/server/dist ./apps/server/dist
COPY package.json pnpm-workspace.yaml ./
EXPOSE 3200
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:3200/v2/health || exit 1
CMD ["node", "apps/server/dist/main"]
