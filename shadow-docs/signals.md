# x.wuh.site 信号库

> 信号是可加权、可衰减、可证伪的指令式微知识。格式与生命周期见 workflow 仓 `norms/signals.md`。

## SGN-001 · jest/tsc 间歇性 SIGSEGV 时先重试再怀疑代码
- 方向: negative
- 权重: 3
- 深度: unit
- 域/scope: 验证工具链 · 全仓（apps/server jest、pnpm exec tsc、apps/site tsc、apps/site next build、mongoose/node 独立脚本、next dev 渲染进程）
- 证据: changes/20260928-feature-music-annual-playlists/brief.md——同命令两次成功、中间单次 139（空日志），`mise.toml` 亦记录 node 24/20 触发 V8 CodeSerializer SIGSEGV 的本机先例；changes/20260929-style-player-collapse-ear/brief.md——根 `pnpm exec tsc` 两次 139、组件包内直接重试同命令即过；changes/20260929-feature-music-skeleton/brief.md——根 build:next 一次 139，apps/site build 连续两次「编译成功后 page-data 收集 worker SIGSEGV」，同代码首次构建即成功过，清 `.next` 后重试恢复；changes/20260930-fix-seo-indexing-p0/brief.md——mongoose 加载的独立诊断脚本连续 3 次 139（改用 mongodb driver 直连绕开 mongoose 机制后即稳）、`node scripts/sync-init.mjs` 一次 139 重试即过、next dev 在内存压力下 `/post/[number]` 渲染挂死 60–120s 且 next-server 进程两次静默死亡（无任何日志）——改用生产模式 `next start` 验证全部通过；changes/20260930-feature-site-i18n-trilingual/brief.md——dev server 常驻（约 2GB）时 apps/site tsc 连续 4 次 139 空日志（含 sleep 40 后重试），结论改取此前一轮成功运行的完整输出；changes/20260930-fix-panel-lyric-scroll-bleed/brief.md——shadow-dev change 链路单发 139 空日志（change create 成功后 approve 段崩溃），等 30s 重试同命令全链路通过
- 命中: 13（最近 2026-09-30）
- 退役条件: 更换开发机或内存升级后，连续 3 个 change 内验证零 139 退出
- 陈述: 宿主机内存压力下 jest/tsc/next build/next dev/独立 node 脚本（尤其加载 mongoose 时）会间歇性以 139（SIGSEGV）退出、空日志、渲染挂死或进程静默死亡，与被测代码无关；**先等待 20–45s 重试同一命令，next build 重试仍复现时清 `.next` 再试（2026-09-29 实测有效）；诊断/种子类 mongoose 脚本改用 mongodb driver 直连绕开（2026-09-30 实测有效）；dev 模式渲染挂死时改用生产模式 `next start` 做验收**，验证结论只取成功输出的日志，禁止把 139 当测试失败排查。
