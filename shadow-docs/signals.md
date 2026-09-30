# x.wuh.site 信号库

> 信号是可加权、可衰减、可证伪的指令式微知识。格式与生命周期见 workflow 仓 `norms/signals.md`。

## SGN-001 · jest/tsc 间歇性 SIGSEGV 时先重试再怀疑代码
- 方向: negative
- 权重: 3
- 深度: unit
- 域/scope: 验证工具链 · 全仓（apps/server jest、pnpm exec tsc、apps/site tsc、apps/site next build）
- 证据: changes/20260928-feature-music-annual-playlists/brief.md——同命令两次成功、中间单次 139（空日志），`mise.toml` 亦记录 node 24/20 触发 V8 CodeSerializer SIGSEGV 的本机先例；changes/20260929-style-player-collapse-ear/brief.md——根 `pnpm exec tsc` 两次 139、组件包内直接重试同命令即过；changes/20260929-feature-music-skeleton/brief.md——根 build:next 一次 139，apps/site build 连续两次「编译成功后 page-data 收集 worker SIGSEGV」，同代码首次构建即成功过，清 `.next` 后重试恢复；changes/20260930-feature-site-i18n-trilingual/brief.md——dev server 常驻（约 2GB）时 apps/site tsc 连续 4 次 139 空日志（含 sleep 40 后重试），结论改取此前一轮成功运行的完整输出
- 命中: 4（最近 2026-09-30）
- 退役条件: 更换开发机或内存升级后，连续 3 个 change 内验证零 139 退出
- 陈述: 宿主机内存压力下 jest/tsc/next build 会间歇性以 139（SIGSEGV）退出且日志为空或止步于 worker 段错误，与被测代码无关；**先等待 20–45s 重试同一命令，next build 重试仍复现时清 `.next` 再试（2026-09-29 实测有效）**，验证结论只取成功输出的日志，禁止把 139 当测试失败排查。
