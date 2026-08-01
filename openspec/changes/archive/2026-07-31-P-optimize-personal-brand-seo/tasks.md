# 任务清单

## Phase 1: 建立回归基线

### Task 1: 增加个人品牌 metadata 失败测试

- [ ] **文件:** `packages/wuh.site.next/test/seo-personal-brand.test.mjs`
- [ ] 检查所有可索引的站点级与列表级页面 description 包含“吴尒红（Shadow）”
- [ ] 检查页面 Open Graph 与 Twitter description 和主 description 同步
- [ ] 排除 `robots: { index: false, follow: false }` 的内部调试页
- [ ] **预计耗时:** 15 分钟；**实际耗时:** 待填写
- [ ] **验证:** `pnpm exec node --test packages/wuh.site.next/test/seo-personal-brand.test.mjs` 在实现前因姓名缺失而失败

### Task 2: 增加结构化身份失败测试

- [ ] **文件:** `packages/wuh.site.next/test/seo-structured-data.test.mjs` 或现有 SEO 测试文件
- [ ] 检查 WebSite、Person、ProfilePage、BlogPosting 共享 Person ID 与统一姓名
- [ ] 检查 Person `sameAs` 保留 `https://github.com/stack-wuh`
- [ ] 检查文章 description 仍使用内容摘要而非统一追加姓名
- [ ] **预计耗时:** 15 分钟；**实际耗时:** 待填写
- [ ] **验证:** 相关测试在实现前因结构化身份仍为 `shadow` / `stack-wuh` 而失败

## Phase 2: 统一个人品牌语义

### Task 3: 更新全局 metadata 与结构化身份

- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/lib/seo.ts`
- [ ] **文件:** `packages/wuh.site.next/app/lib/structured-data.ts`
- [ ] 将公开姓名统一为“吴尒红（Shadow）”，并关联 stack-wuh GitHub 身份
- [ ] 更新全站默认 description、authors、creator、Open Graph、Twitter 及 JSON-LD Person/WebSite/ProfilePage/BlogPosting
- [ ] 保持文章 CMS summary 与正文自动摘要行为不变
- [ ] **预计耗时:** 25 分钟；**实际耗时:** 待填写
- [ ] **依赖:** Task 1、Task 2 的失败基线
- [ ] **验证:** 结构化身份测试通过，原有 SEO builder 测试无回归

### Task 4: 更新所有可索引页面 description

- [ ] **文件:** `packages/wuh.site.next/app/page.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/blog/page.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/topics/[label]/page.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/about/layout.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/about/page.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/weread/page.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/footprint/layout.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/guestbook/page.tsx`
- [ ] 按页面主题自然加入“吴尒红（Shadow）”，并同步 Open Graph/Twitter description
- [ ] 保持现有 robots 与 canonical 行为不变，不修改内部 noindex 调试页
- [ ] **预计耗时:** 30 分钟；**实际耗时:** 待填写
- [ ] **依赖:** Task 1 的失败基线
- [ ] **验证:** 个人品牌 metadata 测试通过

## Phase 3: 完整验证

### Task 5: 运行 SEO 与构建回归

- [ ] **文件:** 无新增业务文件
- [ ] 运行个人品牌 metadata、结构化数据及现有 SEO 相关测试
- [ ] 运行 TypeScript 类型检查、Lint 与 Next.js 构建
- [ ] 抽查首页、About、博客、主题页、微信读书、足迹、留言板输出的 HTML metadata
- [ ] **预计耗时:** 20 分钟；**实际耗时:** 待填写
- [ ] **依赖:** Task 3、Task 4
- [ ] **验证:** 所有质量门禁通过，页面 metadata 与 JSON-LD 满足增量规范

## 验收

- [ ] 所有可索引的站点级与列表级页面 description 均自然包含“吴尒红（Shadow）”
- [ ] 各页面 description 与主题相关，不使用完全相同的模板化摘要
- [ ] 页面 Open Graph 与 Twitter description 不遗漏姓名
- [ ] authors、creator、WebSite、Person、ProfilePage、BlogPosting 使用一致身份并关联 stack-wuh
- [ ] 文章详情 description 仍优先使用 CMS summary，回退正文首个有效段落，不机械追加作者姓名
- [ ] 内部 noindex 调试页保持现有索引策略，不要求姓名覆盖
- [ ] canonical、sitemap、路由和 API 行为无变化
- [ ] `pnpm exec node --test packages/wuh.site.next/test/seo-personal-brand.test.mjs` 通过
- [ ] SEO 相关测试全部通过
- [ ] `pnpm exec tsc --noEmit` 零错误
- [ ] 项目 Lint 与 `pnpm build:next` 通过
