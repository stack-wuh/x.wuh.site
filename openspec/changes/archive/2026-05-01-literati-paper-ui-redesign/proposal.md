# Proposal: 文青纸张风 UI 重新设计

## 动机

当前首页暖红/金色调卡片网格布局缺乏个性，与博客 introspect、文青气质的写作风格不匹配。同时 GitHub API 不再返回 `body_html` 字段，导致博客详情页内容空白无法正常展示。

## 变更范围

### Phase 1: 设计令牌改造 (packages/components/themes)
1. 重写 `generator-color.ts` 暖纸色系（象牙白纸张 + 深棕墨水 + 陶土赭石点缀）
2. 更新 `cssVariableProvider.tsx` 4 个主题分支（light/dark + root/plain）
3. 微调 `index.ts` 字号/间距/圆角

### Phase 2: 首页重构 (packages/wuh.site.next/app)
4. `HomeView.tsx` 完全重写：小 Hero + 格言区 + CTA + 社交链接 + 时间线博客 + 紧凑项目列表
5. 装饰分隔线 (OrnamentDivider) 分隔 Section

### Phase 3: 辅助组件 (packages/components + app)
6. `BlogListView.tsx` 卡片网格 → 单列书卷时间线
7. `Tag/index.tsx` 纸风格标签（左侧色条 + 小圆角）
8. `Button/tokens.ts` + `index.tsx` 圆角微调 + ink-wash ripple
9. `Skeleton/index.tsx` 闪烁渐变适配暖色系
10. `blog/loading.tsx` + `post/[number]/loading.tsx` 骨架屏重设计

### 修复: 详情页空白
11. 前端 `PostView.tsx` 新增 `marked` 解析 markdown body
12. 新增独立 `sync-init.mjs` 同步脚本（绕过 NestJS ts-node 段错误）

## 非目标

- 不更换外部字体（使用系统衬线字体栈）
- 不改变双主题切换机制
- 不动后端 NestJS 接口
