FROM registry.cn-hangzhou.aliyuncs.com/aliyun-node/alinode:20-alpine
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable \
  && corepack prepare pnpm@9.15.0 --activate \
  && pnpm config set registry https://registry.npmmirror.com \
  && apk add --no-cache curl

WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages packages

RUN pnpm install --frozen-lockfile

FROM deps AS builder
RUN pnpm run build:next

FROM deps AS prod-deps
RUN pnpm run --prod --filter @wuh.site/next

FROM base AS runner
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/packages/wuh.site.next/.next ./packages/wuh.site.next/.next
COPY --from=builder /app/packages/wuh.site.next/public ./packages/wuh.site.next/public
COPY package.json pnpm-workspace.yaml ./

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD sh -c 'curl -f http://localhost:3000/_next/healthz || curl -f http://localhost:3000/ || exit 1'

CMD ["pnpm", "run", "start:next"]
