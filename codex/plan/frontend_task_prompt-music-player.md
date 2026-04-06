- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-music-player.md`
- **任务分级与预算 / Sizing & Budget**：Tentative `L`（待确认）；预计 2-3 天投入；建议拆分 6 子任务（接口/数据层、小组件 UI、播放面板 UI、联动逻辑、跨页面持久化、QA & 文档）；首轮上下文读取保持在 15 个文件 / 1500 行内；如需额外上下文（例如历史播放器/第三方 API SDK）先输出缺口后再扩展。
- **任务背景 / Background**：wuh.site 仓库为 pnpm monorepo，Next.js 15 应用位于 `packages/wuh.site.next`，共享 UI 在 `@wuh.site/components`；当前在分支 `48-实现音乐播放器支持小控件支持单独面板面板与小控件之间支持联动` 上执行，需遵守 `CODEX_RULES.md` 的 Plan→Patch→Tests→Verify→Risks→PR Summary 顺序、禁止新增依赖、保持向后兼容。站点尚无全局播放器，需要实现网易云风格的全站音乐体验，支持 mini widget + 播放面板并跨页面共享状态。
- **目标与范围 / Goals**
  - 必须完成：
    1. 迷你播放器小组件（可隐藏/悬浮/固定）显示曲目信息并提供基础控制（播放/暂停、上一首、下一首、进度/音量）。
    2. 网易云样式的播放面板（播放队列、封面/歌词、播放模式、音量、拖拽进度、收藏等基础功能）。
    3. 小组件与播放面板共享同一全局播放状态，任意操作即时在双方同步。
    4. 播放器在 Next.js 路由切换时保持播放不断流，状态和队列不刷新（需全局 store / service + hydration 处理）。
    5. 集成一个开放的音乐api服务商，支持音乐播放就可以
  - 可选增强：
    - 提供快捷键、媒体会话 API、桌面通知、歌词滚动特效。
    - 播放队列/音量偏好持久化到 IndexedDB/localStorage。
    - Storybook/文档展示嵌入方式与联动示例。
  - 不在范围：
    - 网易云账号登录/二维码授权/会员支付。
    - 多端实时同步或云端播放记录回写。
    - 其他音乐平台（QQ/Spotify）接入。
- **交互与设计 / UX**：需获取网易云风格参考稿或 Figma；需定义 mini widget 外观（位置、尺寸、展开/收起动效）、播放面板布局（歌词/封面/列表区）、主题/暗色模式适配、移动端栅格、触控与辅助功能（键盘可达性、ARIA）；Loading/空/错误态示意待确认。
- **技术栈约束 / Tech Stack**：Next.js 15 + React 19（`packages/wuh.site.next`），共享 UI 位于 `@wuh.site/components`；全局状态可通过 React Context、自定义 hook 或 Zustand（若允许新增依赖需提前批准）；样式体系需与现有项目一致（styled-components / CSS Modules，待确认）；禁止引入新第三方依赖除非获批；播放器仅在浏览器端运行，SSR 需守卫 `window`。
- **数据与接口 / Data**：使用网易云音乐 API（需确认基址、自建代理或公开服务）；需要歌单/歌曲详情、播放 URL（含签名或 cookie）、歌词 (LRC)、封面；需定义数据契约、缓存策略、错误码映射、重试/backoff；明确跨域/鉴权方式、是否需要 cookieStorage；本地 mock/回退策略未定。
- **状态与权限 / State & Auth**：全局播放器状态（当前曲目、播放队列、播放模式、音量、歌词滚动等）需在应用顶层 Provider 维护，并支持多组件订阅；跨页面持久化可借助 `app/layout.tsx` 顶层单例或 service worker；权限方面当前无需用户登录但需处理 API 限制。
- **可观测性 / Observability**：TBD（可能需埋点播放事件、错误率、停留时长）；需确认是否接入现有埋点或 console logging。
- **开发步骤建议 / Execution Order**：
  1. 确认 API 来源、鉴权与速率限制，定义 TypeScript 接口。
  2. 设计/搭建全局播放器状态管理与音频播放 Service（HTMLAudioElement wrapper、事件转发）。
  3. 实现 mini widget UI + controls，连接全局 store。
  4. 实现播放面板 UI（队列、歌词、封面、进度条）并与小组件联动。
  5. 处理跨页面持久化（Layout 单例/持久层）与错误回退。
  6. 编写 Storybook/demo/文档，执行 lint/build/self-test。
- **交付物 / Deliverables**：新增或更新 `packages/components/player/**`（UI）、`packages/wuh.site.next/app/(components|providers)/PlayerProvider.tsx`（示例）、全局状态 hook（可能位于 `packages/hooks/usePlayer`）、演示页面、API 适配层、手动验证记录，以及必要的 README/Storybook；若改动 `packages/components/**` 或 `packages/hooks/**`，需同步更新对应 Skill 文件。
- **校验标准 / Validation**：手动检查 mini widget 与播放面板功能一致性、播放不断流、切页/刷新行为、异常/空歌单、歌词滚动、移动端交互；自动命令至少涵盖 `pnpm --filter @wuh.site/next lint`, `pnpm --filter @wuh.site/next build`（typecheck），以及播放器模块的单元/组件测试（命令 TBD）；对照 `CODEX_CHECKLIST.md` 勾选范围/质量/测试/回滚。
- **验证策略 / Verification Strategy**：每完成子模块运行对应 lint/targeted tests；集成完成后运行 `pnpm --filter @wuh.site/next lint` + `pnpm --filter @wuh.site/next build`；若组件或 hook 位于共享包，另行执行包内 lint/test（或说明缺失）；最终在 PR 说明中附手动回归步骤。
- **止损与升级 / Stop-Loss**：同一阻塞尝试 ≤2 次；如 API 鉴权/跨域等外部依赖受阻，立即记录问题、已尝试方案及备选（mock/降级），等待用户确认再继续；涉及新依赖或全局架构调整前需获批。
- **依赖与风险 / Dependencies & Risks**：网易云 API 稳定性/速率限制、版权要求、CORS 限制、HTMLAudioElement 在 iOS 后台播放限制、SSR hydration 差异、不同页面重复实例导致音频重建、内存泄漏；若 mini widget 浮层依赖浏览器 API 需确保 degrade；潜在性能影响（持续渲染/歌词）需监控。
- **基础库变更同步 / Skill Sync**：预计会影响 `packages/components/**`（UI）及可能的 `packages/hooks/**`（状态 hook）；实施后须同步更新 `codex/skills/x-wuh-components/SKILL.md` 与 `codex/skills/x-wuh-hooks/SKILL.md` 及其 references。
- **提交信息规范 / Commit Message**：遵循 Conventional Commits，信息末尾追加 `#48`（取自当前分支 `48-实现音乐播放器支持小控件支持单独面板面板与小控件之间支持联动`）；若分支变更需重新确认 issue-id。
- **沟通约定 / Communication**：信息缺失时优先在回复中列 `Pending Input` 与 `假设`；遵循 `CODEX_RULES.md` 输出顺序；须说明任何依赖新增/上下文扩展/权限升级请求。
- **执行提示 / Runbook**：阶段 1 仅生成本计划文件，等待用户补全；阶段 2 开发前再次核对模板并按 `CODEX_TASK_TEMPLATE` pipeline（输入校验→拆解→增量验证→全量验证→交付）执行；缺设计/API 时先产出 mock/方案，不直接编码。

_追加部分：_
- **Pending Input**：
  1. 网易云 API 具体来源（自建服务/第三方部署）、所需歌单/播放资源范围、鉴权方式、是否有频率限制及异常处理策略。
  2. 迷你小组件与播放面板的视觉稿/Figma、尺寸、位置、主题/暗色要求、响应式断点、动效期望。
  3. 播放器挂载位置（全局 Layout? 独立页面?）以及跨页面持久化方案是否允许新 Provider/全局 context。
  4. 播放列表/歌单来源（固定歌单 ID? 多歌单? 用户可配置?）及空态/错误态内容。
  5. 是否需要缓存/本地存储、歌词滚动模式、播放模式（顺序/循环/随机）、快捷键范围。
  6. 目标浏览器/设备覆盖、无障碍/性能指标、是否需要埋点。
  7. 需要的演示/文档形式（README、Storybook、录屏）以及交付路径。
- **Assumptions**：
  - 假设：可以在 Next.js 应用的 Root Layout 中挂载单例播放器 Provider 以维持跨页面状态。
  - 假设：网易云 API 提供 HTTPS 接口且允许前端通过 fetch 调用（若需代理将由后端提供）。
  - 假设：现有项目允许在 `@wuh.site/components` 中新增播放器相关子包，并可在 `packages/wuh.site.next` 中引用。
  - 假设：无需实现网易云账号登录，播放资源可公开访问（DRM 限制不在本次 scope）。
