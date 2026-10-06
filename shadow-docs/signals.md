# x.wuh.site 信号库

> 信号是可加权、可衰减、可证伪的指令式微知识。格式与生命周期见 workflow 仓 `norms/signals.md`。

## SGN-001 · jest/tsc 间歇性 SIGSEGV 时先重试再怀疑代码
- 方向: negative
- 权重: 4
- 深度: unit
- 域/scope: 验证工具链 · 全仓（apps/server jest、pnpm exec tsc、apps/site tsc、apps/site next build、mongoose/node 独立脚本、next dev 渲染进程）
- 证据: changes/20260928-feature-music-annual-playlists/brief.md——同命令两次成功、中间单次 139（空日志），`mise.toml` 亦记录 node 24/20 触发 V8 CodeSerializer SIGSEGV 的本机先例；changes/20260929-style-player-collapse-ear/brief.md——根 `pnpm exec tsc` 两次 139、组件包内直接重试同命令即过；changes/20260929-feature-music-skeleton/brief.md——根 build:next 一次 139，apps/site build 连续两次「编译成功后 page-data 收集 worker SIGSEGV」，同代码首次构建即成功过，清 `.next` 后重试恢复；changes/20260930-fix-seo-indexing-p0/brief.md——mongoose 加载的独立诊断脚本连续 3 次 139（改用 mongodb driver 直连绕开 mongoose 机制后即稳）、`node scripts/sync-init.mjs` 一次 139 重试即过、next dev 在内存压力下 `/post/[number]` 渲染挂死 60–120s 且 next-server 进程两次静默死亡（无任何日志）——改用生产模式 `next start` 验证全部通过；changes/20260930-feature-site-i18n-trilingual/brief.md——dev server 常驻（约 2GB）时 apps/site tsc 连续 4 次 139 空日志（含 sleep 40 后重试），结论改取此前一轮成功运行的完整输出；changes/20261001-fix-og-image-metadata-shadowing/brief.md——next build 连续 5 次失败（2 次空日志 139、2 次「编译成功后 page-data 收集 worker SIGSEGV」、1 次挂死超时），清 `.next` + 内存 63% free 下仍复现，tsc 亦 1 次 139，**重试清缓存均无效时改用 dev 模式做 metadata runtime 验收**（区块页渲染正常，仅 /post/* 曾挂死）；20260930-fix-panel-lyric-scroll-bleed/brief.md——shadow-dev change 链路单发 139 空日志（change create 成功后 approve 段崩溃），等 30s 重试同命令全链路通过；changes/20261005-fix-locale-switch-realtime/brief.md——next build 三次连续失败（1 次 139 空日志、1 次「编译成功后 page-data 收集 worker SIGSEGV」、清 `.next` 后再 1 次 139），**且 `mise exec` 按 `mise.toml` 钉的 node 22.23.2 跑同样 139——换 node 不解决**，当时 swap 5.9G/7.2G、free 1.2G；改 `mise exec -- pnpm --filter @wuh.site/site run dev` 起 dev server 后 runtime 验收全部完成；changes/20261006-fix-player-queue-layer-lyric-follow/brief.md——`pnpm exec tsc` 一次 139 + ambient node 24 直跑 tsc 三连 139（间隔 30–60s 重试不解决、free ~119MB），**换 `mise exec -- node ./node_modules/typescript/bin/tsc --noEmit`（node 22.23.2）同代码 exit 0 一遍过——tsc 场景换 node 有效（与 locale 单 next build「换 node 不解决」不矛盾，因案而异）**；`next build` 一次 139 空日志，清 `.next` 后重试首次即成功；changes/20261006-feature-player-playlist-seal/brief.md——同配方复现：next build 先 page-data SIGSEGV 后 139 空日志、清 `.next` 第三试绿，根 tsc 直接走 `mise exec` node 22 一遍过不再踩坑；changes/20261006-feature-now-playing-equalizer/brief.md——next build 四试一绿（page-data SIGSEGV×2、清 .next 后 139 空日志×1、间隔 3 分钟成功，free 长期 ~200MB），根 tsc mise 一遍过
- 命中: 23（最近 2026-10-06）
- 退役条件: 更换开发机或内存升级后，连续 3 个 change 内验证零 139 退出
- 陈述: 宿主机内存压力下 jest/tsc/next build/next dev/独立 node 脚本（尤其加载 mongoose 时）会间歇性以 139（SIGSEGV）退出、空日志、渲染挂死或进程静默死亡，与被测代码无关；**先等待 20–45s 重试同一命令，next build 重试仍复现时清 `.next` 再试（2026-09-29 实测有效）；诊断/种子类 mongoose 脚本改用 mongodb driver 直连绕开（2026-09-30 实测有效）；dev 模式渲染挂死时改用生产模式 `next start` 做验收；重试与清缓存均无效时改用 dev 模式做 runtime 验收；**根 tsc 多连 139 时改 `mise exec`（node 22）直跑 `node ./node_modules/typescript/bin/tsc`（2026-10-06 实测一遍过）**，验证结论只取成功输出的日志，禁止把 139 当测试失败排查。

## SGN-002 · 跑 node --test 守卫前先核对 node ≥ 23
- 方向: positive
- 权重: 2
- 深度: unit
- 域/scope: 验证工具链 · packages/components/**/*.test.mjs、apps/site/test/*.test.mjs
- 证据: changes/20261005-fix-locale-switch-realtime/brief.md——`mise exec` 下按 `mise.toml` 钉的 node 22.23.2 跑 `node --test packages/components/locales/locales.test.mjs` 直接起不来（守卫靠 `.ts` 原生类型剥离：`import('./translate.ts')`、`import(\`./dictionaries/${lang}/${ns}.ts\`)`，node 22 无此能力），换 ambient node 24 后同一命令 16/16 通过
- 命中: 1（最近 2026-10-05）
- 退役条件: 守卫改为显式经 loader/构建产物读取（不再直读 `.ts`），或 `mise.toml` 的 node 钉到 ≥ 23 且 next 构建在 ≥ 23 下稳定
- 陈述: 仓内 `.mjs` 守卫直读 `.ts` 源码，依赖 node 的原生类型剥离，只在 node ≥ 23 可跑；`mise.toml` 为绕开 V8 SIGSEGV 钉的是 node 22——两者冲突。看到「守卫命令秒退、无测试摘要」先核对 `node -v`，不要判成测试红。（补充证据）

## SGN-004 · 内置浏览器 WKWebView 后台帧饥饿：JS 动画毫秒级时序不可量测
- 方向: negative
- 权重: 3
- 深度: runtime
- 域/scope: 验证工具链 · 一切经 ZCode 内置浏览器（IAB/WKWebView）的 runtime 验收（动画时长曲线、rAF 节拍、水合）
- 证据: changes/20261006-fix-cursor-follow-spring/brief.md——镜像页 :8914 实测 rAF 完全不回调（`visibilityState:'visible'` 下 1.2s race 超时）、页面计时器预算 3 次/秒（140ms sleep 采样呈 300/1300/2300ms 台阶）、framer 弹簧在假帧时钟下可推进且终值精确，但毫秒收敛时长不可测（真实时间线被冻结，量出的时长全是环境伪影）；changes/20261006-feature-custom-cursor/brief.md——同源根因：Next dev 应用在 IAB 内从不水合（renderers=0）
- 命中: 1（最近 2026-10-07）
- 退役条件: 内置浏览器提供前台真实渲染帧或会话内具备真浏览器/CDP 环境
- 陈述: 内置浏览器后台帧饥饿时，「JS 驱动动画的毫秒级时长/逐帧轨迹」不可在其中量测——验收清单应设计为不依赖渲染帧的对象：DOM 类与 dataset、假帧时钟下的单帧落位值、秒级阈值行为（如 idle 5s、定时器泄漏观察器）；主观时长与手感移交真浏览器 field（另起 dev 端口），报告中记录为环境限制偏差即可，不得把「量不到曲线」当「引擎坏了」，也不得为凑量测去改被测代码。

## SGN-003 · CSS 动画/层叠语义疑点先做 /tmp 静态复现页 DOMMatrix 量测再动源码
- 方向: positive
- 权重: 3
- 深度: runtime
- 域/scope: 验证工具链 · packages/components/audio-player（面板 3D 屏动画、层叠、滚动几何语义）
- 证据: changes/archive/20261006-fix-player-queue-layer-lyric-follow/brief.md——镜像几何复现页量测出词卷滚动公式在 vertical-rl 下残差 809.9px（static 滚动容器 offsetLeft 基准漂移 −281px），双分支皆坏的事实先于改码确认；changes/20261006-style-queue-eq-background/brief.md——水印重锚复现页以 getComputedStyle+DOMMatrix.d（=scaleY）量柱高，首帧 [0.35,1,1] 暴露「首挂载即暂停时 delay 段柱回落基准高度」（补 animation-fill-mode: backwards 后 [0.35,0.35,0.35]），相位错开 [0.93,0.96,0.6]→300ms→[0.48,0.36,0.67] 同页双帧证实；changes/20261006-fix-cursor-follow-spring/brief.md——esbuild 实包真 cursor 组件 + 真 framer-motion 建镜像页，假帧时钟下证「首跳同帧落位 matrix(296,196) 零扫移、700px 远跳终值精确收敛」，替代了上一轮「逐字手抄引擎」形态
- 命中: 3（最近 2026-10-07）
- 退役条件: 面板样式具备无头视觉回归环境（不再需要手写复现页）
- 陈述: 3D 转正屏上的小尺寸动画、亚像素裁切与层叠次序无法靠读源码或正则守卫判定——先建单文件 /tmp 复现页镜像最终 CSS 几何（127.0.0.1 起静态服务；goto 不吃 file:），页面内 evaluate 读 computed transform 做双帧量测；比整机 dev 服务器轻得多，不触 SGN-001 内存悬崖。动画含 delay 且靠 play-state 冻结的，必须专测「首挂载即暂停」帧形。**涉及 React 组件与第三方库行为时，镜像页从「手抄引擎」升级为「esbuild 实包真组件」**：`build({ stdin:{ resolveDir: 消费者包目录 } })` 直接打包真源码（react/react-dom/库全部解析真包，pnpm 双份 react 靠 realpath 去重），保真度最高且 200ms 级完成；配合页面内注入的可暂停假帧时钟（在 bundle 前替换 rAF 引用）可做单帧精确落位量测。
