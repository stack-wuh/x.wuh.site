# ==================== Deps ==============
# =================== 安装依赖 =============
FROM mhart/alpine-node as deps
LABEL maintainer = "shadow <wuh131420@gmail.com>"

WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/

RUN apk add jq
RUN npm config set registry https://registry.npmmirror.com
RUN yarn

# ================== Builder ================
# ================= 编译 ===================
FROM mhart/alpine-node as builder
WORKDIR /usr/src/app

COPY . /usr/src/app/
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN yarn build

# ============== Runing ===========
# ============== 运行时 ===========
FROM mhart/alpine-node AS runner
WORKDIR /usr/src/app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]