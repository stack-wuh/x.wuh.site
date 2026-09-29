# x.wuh.site 信号库

> 信号是可加权、可衰减、可证伪的指令式微知识。格式与生命周期见 workflow 仓 `norms/signals.md`。

## SGN-001 · jest/tsc 间歇性 SIGSEGV 时先重试再怀疑代码
- 方向: negative
- 权重: 2
- 深度: unit
- 域/scope: 验证工具链 · 全仓（apps/server jest、pnpm exec tsc、apps/site tsc）
- 证据: changes/20260928-feature-music-annual-playlists/brief.md——同命令两次成功、中间单次 139（空日志），`mise.toml` 亦记录 node 24/20 触发 V8 CodeSerializer SIGSEGV 的本机先例；changes/20260929-style-player-collapse-ear/brief.md——根 `pnpm exec tsc` 两次 139、组件包内直接重试同命令即过
- 命中: 2（最近 2026-09-29）
- 退役条件: 更换开发机或内存升级后，连续 3 个 change 内验证零 139 退出
- 陈述: 宿主机内存压力下 jest/tsc 会间歇性以 139（SIGSEGV）退出且日志为空，与被测代码无关；**等待 20–45s 重试同一命令即可恢复**，验证结论只取成功输出的日志，禁止把 139 当测试失败排查。
