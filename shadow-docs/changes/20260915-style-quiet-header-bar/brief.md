---
{
  "schema": "shadow-dev/v1",
  "name": "20260915-style-quiet-header-bar",
  "type": "style",
  "scope": "apps/site",
  "status": "published",
  "baseBranch": "main",
  "branch": "style/20260915-style-quiet-header-bar",
  "files": [
    "apps/site/app/components/SiteHeader/index.tsx",
    "apps/site/app/components/SiteHeader/styles/index.ts",
    "apps/site/app/components/SiteHeader/AppearanceOptions.tsx",
    "apps/site/test/header-quiet-bar.test.mjs",
    "shadow-docs/knowledge/design-system.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 383,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/383",
    "pullRequest": 384,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/384"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "889c981e444b357be856c1284f8d34b17ae5c4eb",
    "verifiedAt": "2026-09-15T10:17:40.686Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:384",
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# Header 静默条重设计：减法视觉语言 + 排版令牌对齐

## 动机

Footer 上一轮（20260914-fix-footer-type-scale）立下的排版规矩——辅助层 12px、行高局部变量、间距/圆角/偏移只经令牌、字体族自持——Header 一条都不满足。浏览器实测（wine/plain × 1280/700/375）确认五条真实缺陷：

1. **字体族未自持**：Header 挂在 `AppProviders`（页面容器之外），根层无 `font-family`，全部文字落到 `Microsoft YaHei`，根字号是浏览器默认 16px。
2. **素雅主题 `--font-size-sm` 陷阱**：NavLink/外观按钮用 `sm` 档，wine 13px、plain 15px（与 base 同值），素雅主题导航层级消失。
3. **整层行高 `normal`**：全站行高令牌覆盖不到，纵向节奏全靠裸 padding。
4. **野断点 768px**：与站点内容断点 640 失配——实测 700px 下内容区桌面布局、Header 已收起汉堡。违反 design-system 卡「只用语义常量」。
5. **移动端菜单项 16px**：`font: inherit` 继承浏览器默认值，比桌面导航还大、不在任何令牌档位。

另有多处裸 px（padding 14/gap 12/下划线 bottom 6/弹层 292·16·20·10/色板 7·13·650 等）。同时，现状的「外观」胶囊按钮（底色+文字+chevron）与 design-system 卡「外观入口与导航风格统一」的既有规范相悖。

## 引用规范

- shadow-docs/knowledge/design-system.md
  - 当前结论: 语义断点 mobile 640/small 520/tablet 1024，新代码不得引入裸断点；桌面端外观入口与导航风格统一；导航悬停用 1px 两端透明中段 `--primary-color` 的渐隐下划线。
  - 适用 scope: packages/components/themes、apps/site 全站
- shadow-docs/knowledge/footer-design.md
  - 当前结论: 辅助文字 `--font-size-xs`（12px 四主题同值）；`--font-size-sm` 在素雅被覆写为 15px 不可用于辅助层；挂在页面容器外的块必须自持 `font-family: var(--font-sans)`；间距与偏移只经令牌；容器外框发丝线 `1px solid color-mix(in oklab, var(--text-muted) 18%, transparent)`。
  - 适用 scope: 全站「页面容器之外」的 chrome 块（Header 是第二个实例）

## 决策

- **选型:** 静默条——Header 的唯一职责是导航与主题入口，其余视觉全部退后。
  - 根层自持 `font-family: var(--font-sans)` + `--header-lh: 1.5`（Header 是控件条，1.5 紧凑档自持变量，不引全站 `--line-height-body`）。
  - 导航三项统一辅助层 12px（`--font-size-xs`，四主题稳定），`column-gap: var(--space-sm)`；**项间不加分隔线**——发丝线是页脚密行的语言，导航留白本身即分隔。
  - 外观入口去胶囊：纯调色板图标按钮（16px svg），与导航同渐隐下划线/同字号档，去文字「外观」与 chevron；弹层功能与结构不变。
  - 断点 768px 全部改 `BREAKPOINTS.mobile`（640）；700px 带 Header 与内容同步桌面形态。
  - 内层纵向 padding 收到 `--space-base`（14→12），整层高度 66.7 → ~56px；横向 gutter 改 `--space-md`（clamp(20,4vw,28)）与内容列同轴。
  - 底边框改页脚同档发丝线 `--text-muted 18%`。
  - 弹层与移动面板按令牌重描：圆角 `--border-radius-xl`(20)/`md`(12)、间距 `--space-*`、字号 11→`xs`12、17→`md`17（已核实 plain 覆写中 md=17 与 wine 同值）、字重 650→600（真实字面只有 400/500/600/700，全局禁合成）；移动菜单项字号 `--font-size-base`15。
- **对比方案:**
  - 中轴对仗（logo 居中两翼对称）：与页脚首尾同构更「整」，但居中主导航对信息型站点是反模式，且品牌左锚点习惯被打破——用户反馈「需要这么复杂吗」否决。
  - 刊头+滚动收拢：品牌感最强，但引入滚动监听/view-timeline、SSR 与性能面扩大，范围失控——否决。
  - 纯令牌化不动视觉（A 档）：胶囊外观按钮与导航风格不统一这一既有规范违反得不到纠正——否决。
- **理由:** 重设计的方向是减法而非构图。结构观感保持「左 logo 右导航」，视觉重量显著下降；所有取值回归令牌体系，与页脚共用同一套证据过的档位（xs 12/base 15/md 17 四主题稳定），层级在 wine/plain 下不再漂移。
- **追加决策（实施后用户反馈「PC 端字号太小」）:** 撤销「导航行继承根层 12px 辅助档」——Header 导航是主动线入口，不该照搬页脚（次要重复信息）的档位。改为 Header 局部变量 `--header-fs: 13px`（wine 历史值），理由：13px 在四主题没有稳定令牌（`--font-size-sm` 素雅覆写 15px 正是体检抓出的陷阱），仿照页脚 `max-width` 用 `BREAKPOINTS` 常量的先例取局部字面量并注释豁免。再经一轮反馈「PC 仍偏小、平板刚好」→ 补响应式分档：`--header-fs` 在 640–1023 平板带保持 13px，≥1024（`BREAKPOINTS.tablet`，站点既有语义断点）升 `--font-size-base` 15px（四主题稳定档，宽屏参照系下主导航与正文同档才立得住）。实测：900px 13px/栏高 60.2，1024/1025/1280 15px/栏高 63.2；移动端菜单项维持 base 档 15px 不受影响。
- **追加决策（用户反馈「logo 是否随断点、外观图标没跟文字对齐」）:** ① 对齐问题的根因不是几何居中（实测图标中心与文字行盒中心同 y），而是外观按钮盒高 34（图标 18+padding 16）与导航盒高 38.5（字号×1.5+16）不等，hover/展开时下划线差 2.2px。修法：触发器声明 `font-size: var(--header-fs)` + `min-height: calc(1em * var(--header-lh) + var(--space-xs) * 2)` 锚到同一行盒。**踩坑记录：`font` 简写排在 `font-size` 之后会把先声明的字号重置回继承值（实测 15→12），必须把 `font: inherit` 写在前面**，已加为守卫断言（调换顺序即红）。② logo 与导航同参照系缩放：`Brand svg { height: calc(var(--header-fs) * 2); width: calc(var(--header-fs) * 2 / 26 * 42) }`（高=字号档×2 恰好等于原 42×26 的 26，宽按原比例），分档变化由 `--header-fs` 单点承担、不新增断点。终验：1280 导航/按钮盒均 38.5、下划线差 0、logo 48.5×30；900 均 35.5、差 0、logo 42×26；375 不变（68.7），三档无横向溢出。
- **追加决策（用户要求重设计主题选择器，方向讨论后选「试笔墨签」）:** 旧弹层是 SaaS 设置卡语言（毛玻璃/inset 白高光/彩色胶囊/假渐变色板），与静默条纸墨语言冲突。重设计三件套：① 容器换纸卡（不透明 `--background-100` + 发丝线 + 圆角 base + `--elevation-soft`），删「外观设置」标题行；② 主题色板换成真实样本——每主题的纸（`--_wl/pl-background-900`）、墨（normal-900）、朱线（primary-500/600，ornament 渐隐语言），衬线「朝」字高 = `--header-fs×2` 与 logo 同参照系；预览色引 Layer 1 原始变量（恒挂 :root、不随当前主题路由），修正 design-system 卡旧规「固定渐变色值」为「原始调色板变量」——语义不变（预览独立于当前主题）、消除复制漂移；③ 明暗段去彩色胶囊，改发丝线分隔墨字 + 选中渐隐下划线，与导航交互语言首次同源。**顺带修出暗色对比度反向 bug**：`--text-secondary`(normal-600) 在暗色比正文 `--text-color`(normal-500) 更亮，选中项反而比未选中暗——Header 弃用 text-secondary，淡化统一 `text-color` 72% mix，加全局守卫断言。真实点击路径终验四主题纸面各自正确（探针直接改属性会与 ThemeModeProvider 竞态出假数据，验证主题路由必须走 UI 点击）。

## 任务

### Phase 1 · 静默条实现（styles/index.ts + index.tsx）

- [x] 根层自持字体族与行高：`HeaderRoot` 加 `font-family: var(--font-sans)`、`--header-lh: 1.5`、`font-size: var(--font-size-xs)`；删根级隐式默认——`styles/index.ts`
- [x] 断点收敛：`const BREAKPOINT = '768px'` → 引入 `BREAKPOINTS.mobile`，所有 `min-width` 媒体查询改 `${BREAKPOINTS.mobile}px`——`styles/index.ts`
- [x] 导航字号档位：`NavLink` `--font-size-sm` → `--font-size-xs`；`Nav` `gap: 12px` → `var(--space-sm)`；`NavLink` padding 令牌化；下划线 `bottom: 6px` / `left|right: 12px` → 间距令牌推导——`styles/index.ts`
- [x] 外观入口图标化：`AppearanceTrigger` 去胶囊底色/去文字与 chevron，只留 16px 调色板图标，共用导航的渐隐下划线语言；`index.tsx` 移除「外观」span 与 `ThemeChevron`（桌面端）引用，aria-label 保留当前主题信息——`styles/index.ts` + `index.tsx`
- [x] 内层与容器：`HeaderInner` padding `14px clamp(...)` → `var(--space-base) var(--space-md)`；`HeaderRoot` 底边框改 `--text-muted 18%` 发丝线；`Right` gap 令牌化——`styles/index.ts`
- [x] 弹层令牌重描：padding/margin/gap/radius/offset 全部 `--space-*`/`--border-radius-*`；`AppearanceHeading` 17px → `--font-size-md`（serif 保留）；`small`/`AppearanceLabel`/`SchemeOption` 11px → `--font-size-xs`；`ThemeSwatch`/`SchemeOption` 650 → 600；focus ring `outline-offset: 3px` → `calc(var(--space-xs) / 2)`——`styles/index.ts`
- [x] 移动面板令牌重描：`MobileItem` 去 `font: inherit` 链上的默认 16px，显式 `--font-size-base`；padding/gap/radius 令牌化（14px→`--border-radius-md` 等）；`MobileToggle` 保持 44px 触摸底线上限不动——`styles/index.ts`

### Phase 2 · 守卫与验证

- [x] 新增 `apps/site/test/header-quiet-bar.test.mjs`：静态守卫（源文件级正则断言）——①HeaderRoot 含 font-family/--header-lh；②样式中无 `--font-size-sm`；③无 768 裸断点、断点引用 BREAKPOINTS；④间距/偏移/圆角类属性无裸 px（描边 1px/outline 1.5px 豁免）；⑤无 `font-weight: 650`；每条断言做变异验证——`apps/site/test/header-quiet-bar.test.mjs`
- [x] 浏览器实测：wine/plain × light/dark × 1280/700/640/520/375——字体族 Noto Sans SC、导航 12px/行高 18px(1.5)、plain 主题导航不再 15px、700px 出桌面导航、375 菜单项 15px、弹层无溢出、hover 下划线完整；记录页高 ~56px——本地 dev
- [x] `pnpm exec tsc --noEmit` + 新测试全绿

### Phase 3 · 主题选择器「试笔墨签」重设计（用户追加：与静默条不搭配）

- [x] 弹层容器换纸卡语言：不透明 `--background-100`、发丝线、圆角 `base`、`--elevation-soft`，去毛玻璃/inset 白高光；删 `AppearanceHeading` 标题行（当前态回显冗余）——`styles/index.ts` + `index.tsx`
- [x] 墨签样本：主题色板卡改「纸+墨+朱线」试笔样（衬线「朝」= `--header-fs×2`、Divider ornament 渐隐线），色值引 Layer 1 原始变量 `--_wl-*`/`--_pl-*`（恒挂 :root 不随主题路由，预览零复制漂移）；选中态 = 边框主色 + label 实色 + 朱砂点——`styles/index.ts` + `AppearanceOptions.tsx`
- [x] 明暗三段：彩色胶囊改发丝线分隔墨字段，选中项用与导航同源的渐隐下划线——`styles/index.ts`
- [x] 修暗色对比度反向 bug：Header 全域弃用 `--text-secondary`（暗色调色板反向，比正文更亮），淡化表达统一 `color-mix(--text-color 72%, transparent)`；守卫断言禁止回退——`styles/index.ts`
- [x] 守卫测试扩至 14 条（纸卡/原始变量/下划线选中/装饰件退场/文案）+ 变异验证 + tsc——`test/header-quiet-bar.test.mjs`
- [x] 真实点击路径终验四主题：弹层纸面 酒红浅 `#FFFBF8`/酒红深 `#111`/素雅浅 `#FFFDF9`/素雅深 `#1C1814`，桌面+移动双实例状态同步——本地 dev

## 结果

- 实际耗时: 2026-09-15（propose → apply → 三轮用户反馈追加 → 墨签重设计，同日完成）
- 验证: 守卫测试 14 条全绿（含 13 轮变异验证，全部"改坏必红"）；`tsc --noEmit` 干净。静默条实测：Noto Sans SC、导航 13px/平板·15px/PC 分档、行高 1.5、断点 641/700/1280 桌面态同步、375 汉堡、图标与导航下划线同 y（差 0）、logo 随档 42×26→48.5×30、移动菜单项 15px、320–1280 无横向溢出。墨签弹层实测：真实点击路径四主题轮转，纸面 `#FFFBF8`/`#111`/`#FFFDF9`/`#1C1814` 各自正确，选中下划线 opacity 1/未选中 0，桌面+移动双实例状态同步。验证纪律：主题路由必须走 UI 点击——setAttribute 直改会与 ThemeModeProvider 竞态出假数据。

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/design-system.md
- **理由:** 桌面端 Header 段落要改写为静默条 + 试笔墨签结论（导航 13/15 双档 `--header-fs`、外观入口图标化、`--header-lh` 1.5、底边框发丝线、断点 640、弹层纸卡语言）；「Header 导航」在 footer-design 卡的适用边界里被排除、归 design-system 卡管辖，无需新建卡片。两条跨组件可复用事实必须写入：① `--text-secondary` 在暗色调色板反向（比正文亮），淡化表达应使用 `text-color` opacity mix；② 主题预览取 Layer 1 原始变量 `--_wl/--pl-*` 即可脱离当前主题路由，替代「写死色值」旧规。验证纪律类发现（探针直改属性与 ThemeModeProvider 竞态）留在本 brief，不进卡片。
