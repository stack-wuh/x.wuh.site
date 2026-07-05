# About 页面留言板群聊化改造

## 背景

About 页面新增留言板后，原弹幕式入口和弹窗存在几类问题：
- 弹幕持续动画在弹窗内播放不够稳定，消息增多后容易卡顿。
- 弹幕布局不利于回看留言，也不符合“留言板”的长期阅读场景。
- 发送失败时前端只显示笼统状态，Next / Nest 侧缺少可定位日志。
- About 页面入口视觉像一个独立功能按钮，与页面中“最近日志”“足迹”等内容模块不协调。

## 目标

- 将留言弹窗从弹幕式浏览改为类似微信群聊的消息流。
- 点击发送后立即提交留言，并在消息气泡内展示发送中、已发送、发送失败状态。
- 缓存用户昵称，后续进入时自动带出。
- 为 `/api/comments` 增加 Next Route Handler 代理，提交失败时输出服务端日志并返回可读错误。
- 对齐 Nest 留言 DTO / schema，使 `page` 字段与匿名 UUID 留言可正常保存。
- 重设计 About 页面留言板入口，使其成为 About 页自然的内容 section。
- 分离 Next dev / build 输出目录，避免生产 build 污染 dev CSS chunk。

## 非目标

- 不新增留言历史拉取与分页。
- 不实现失败消息重试按钮。
- 不修改 MongoDB 已有历史数据迁移脚本。
- 不调整 About 页面其他模块的信息架构。

## 影响范围

- `packages/wuh.site.next/app/about/AboutView.tsx`
- `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- `packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.js`
- `packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.test.js`
- `packages/wuh.site.next/app/api/comments/route.ts`
- `packages/wuh.site.next/next.config.ts`
- `packages/wuh.site.next/tsconfig.json`
- `packages/wuh.site.nest/src/modules/comment/*`
- `packages/shared-contracts/src/index.ts`
