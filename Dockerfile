# Stage 1: base
FROM node:20-alpine AS base
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
  && corepack prepare pnpm@9.15.0 --activate \
  && apk add --no-cache curl
WORKDIR /app

# Stage 2: deps
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages packages
RUN pnpm install --no-frozen-lockfile

# Stage 3: builder-next
FROM deps AS builder-next
RUN pnpm run build:next

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
  CMD curl -f http://localhost:3000/_next/healthz || exit 1
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
