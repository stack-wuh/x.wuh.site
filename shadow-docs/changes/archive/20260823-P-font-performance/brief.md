# 字体加载性能优化：降低 FCP/FP

## 动机

首页加载了 3 个 Google 字体家族共 **209 个字体文件（11MB）**，严重拉低 FCP/FP。

- `Noto_Sans_SC`：4 个字重（400/500/600/700）
- `Noto_Serif_SC`：4 个字重（400/500/600/700）
- `JetBrains_Mono`：默认字重

CJK 字体（Noto Sans SC / Noto Serif SC）每个字重会被 next/font 拆分成几十个 unicode-range 分片文件，4 字重 × 2 家族 = 8 个中文字重文件组，这是 209 个文件的来源。

## 现状审计

| 项 | 现状 | 问题 |
|---|---|---|
| 字体文件 | 209 个 woff2，共 11MB | CJK 字体按字重 × unicode-range 拆分 |
| Noto Sans SC | 4 字重 | 样式实际用 500/600/700 为主，400 为默认值 |
| Noto Serif SC | 4 字重 | 仅用于标题/引言（17 处） |
| JetBrains Mono | 默认字重，preload | 仅代码块 + 设计调试页使用（5 处） |
| font-display | `swap` | 字体加载期间用 fallback，FCP 可改善为 `fallback`/`optional` |
| 字重覆盖 | 样式含 650（SiteHeader）、800（ErrorPage） | 这俩不在已加载字重列表，浏览器自动合成 |

## 决策

### 1. 减少中文字重：4 → 2

- `Noto_Sans_SC`：400/500/600/700 → **400 + 700**
- `Noto_Serif_SC`：400/500/600/700 → **400 + 700**

理由：
- 中文字体每个字重都是完整 unicode-range 分片组，字重数量直接乘以分片文件数
- 样式实际依赖 500/600/700，但 500/600 与 400 视觉差异小，浏览器对 500/600 会用最近字重合成（CJK 合成在 400→700 区间表现可接受）
- 650/800 本身不在加载列表，已是合成渲染，不受影响

### 2. JetBrains Mono 关闭 preload

`JetBrains_Mono({ preload: false })`。首页无代码块，无需预加载；仅在文章页/调试页按需加载。

### 3. font-display 改为 `fallback`

`swap` → `fallback`：3s 内加载完成则替换，否则保持 fallback。比 `optional` 保守（保证最终显示自定义字体），比 `swap` 减少 FOUT 闪烁。

### 4. 检查 650/800 字重是否需要收敛

- SiteHeader 的 650 → 视觉上是导航标题，保持 650（由 700 合成）或显式改 700
- ErrorPage 的 800 → 错误页兜底场景，保持

### 5. 字体子集化自托管（方案 D）

Google Fonts 的 CJK 字体按 unicode-range 拆分成几十个分片，每个分片都是完整字形子集。个人站实际用到的汉字远小于全量 CJK 字库，可裁剪出「站点实际字符集」的自定义 woff2 子集，自托管到 `/fonts/` 静态目录。

**方案**：
- 使用 `fonttools`（Python）或 `subset-font`（Node）裁剪 Noto Sans SC / Noto Serif SC 400+700 为站点实际用字子集
- 字符集来源：全站文章 Markdown 正文 + 界面文案（扫描 dist HTML 提取）
- 自托管：`apps/site/public/fonts/*.woff2`，`next/font/local` 或手写 `@font-face` 引用
- 收益：**209 文件 11MB → 4 个文件约 300-600KB**（2 家族 × 2 字重），每个文件 100KB 量级

**注意**：子集化后新增文章若含未收录汉字会缺字，需在发布流程中定期重建子集（或构建时自动化）。

### 6. 关键字体异步加载（方案 F）

首屏只渲染/加载必要字重，非关键字体延迟加载：
- 首页首屏只需 sans 400 渲染正文，serif 标题 400/700、sans 700 可异步补齐
- 实现：对非关键字重的 `@font-face` 用 `font-display: optional`（0.1s 内未加载完成则本次会话不再使用），或 JS `document.fonts.load()` 空闲时预热
- 与方案 3（display: fallback）配合：正文用 fallback 保底，装饰性字重用 optional 不阻塞

## 预期收益

- 字体分片文件数：209 → 5（2 家族 × 2 字重 + JetBrains Mono）
- 字体总大小：11MB → 约 1.1MB（磁盘与请求字节同量级下降）
- FCP/FP：首屏字体请求从几十个分片降到 4 个文件，带宽和请求数大幅下降

## 任务

- [x] A. `layout.tsx`：Noto Sans SC / Noto Serif SC 字重减为 400+700
- [x] B. `layout.tsx`：JetBrains Mono 添加 `preload: false`
- [x] C. `layout.tsx`：三处 `display: 'swap'` 改为 `fallback`
- [x] D. 字体子集化：扫描全站字符集 → 裁剪 4 个 woff2 → 自托管替换 next/font/google
- [x] F. 非关键字重异步加载：新增 `FontPrefetch` 组件，空闲时 `document.fonts.load()` 预热 sans 700 / serif 400/700
- [x] 验证：首页字体请求 209 → 4 个文件

## 结果

### 改动文件

- `apps/site/app/layout.tsx` — 字重 4→2、display fallback、Mono preload:false、切换 `next/font/local`
- `apps/site/app/components/FontPrefetch.tsx` — 新增，空闲时预热非首屏字重
- `apps/site/public/fonts/` — 5 个自托管子集 woff2

### 数据对比

| 指标 | 优化前 | 优化后 |
|---|---|---|
| 字体文件数 | 209 | 5 |
| 字体总大小 | 11MB | ~1.1MB |
| 首页字体请求 | 209 个 unicode-range 分片 | 4 个文件 |
| Noto Sans SC 字重 | 400/500/600/700 | 400/700 |
| Noto Serif SC 字重 | 400/500/600/700 | 400/700 |
| JetBrains Mono | preload | preload: false（按需） |
| font-display | swap | fallback |
| 子集字符集 | 全量 CJK | 1798 汉字（文章+界面+品牌字） |

### 验证

- 首页 HTML 仅引用 4 个自托管字体文件，Google Fonts 分片全部消失
- 网络面板：4 个 woff2 全部 200，JetBrains Mono 未请求
- 页面中文渲染正常，品牌字「吴尒红 朝朝如念 雾失楼台 月迷津渡」均在子集内
- dev server 正常，无新增 console 错误（既有 hydration mismatch 与字体无关）

### Review 修复（FontPrefetch 两处 bug）

1. **family 名解析错误**：原实现从 `document.documentElement` 的 CSS 变量读字体名，读到的是 `cssVariableProvider` 的 fallback 栈（`Noto Sans SC`/`Georgia`），而非 next/font 实际注册的 `notoSansSC`/`notoSerifSC`。修复：改从 layout 传入 `localFont` 实例的 `style.fontFamily`。
2. **`document.fonts.load` 签名错误**：`load('700 16px', family)` 双参数形式把第二个参数当 text 而非 font 简写，导致 reject 被 `.catch` 静默吞掉、预热完全无效。修复：改单字符串 `load('700 16px notoSerifSC')`。

修复后验证：`document.fonts.check('700 16px notoSerifSC')` → true，sans 700 / serif 400 / serif 700 均预热加载。

### 子集化脚本

`/tmp/font-source/subset-fonts.py`（fonttools + venv）— 字符集来自 GitHub Issues 文章正文 + 界面文案 + 品牌字。新增文章含未收录汉字时会 fallback 系统字体，需定期重建子集。

## 风险

- 500/600 字重由 400 合成，中文粗体合成在部分平台（Windows 尤甚）可能偏细/偏假。若视觉不可接受，回退方案：Sans 保留 400/600/700 三字重。
- serif 标题在 500/600 合成后气质变化，需视觉验收。
- 子集化缺字风险：新增文章含未收录汉字会 fallback 系统字体，需要构建时自动重建子集。
- 子集化后字体不可变：Google Fonts 更新字形/修复后需手动重新裁剪。