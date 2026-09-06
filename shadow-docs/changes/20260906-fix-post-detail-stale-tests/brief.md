---
{
  "schema": "shadow-dev/v1",
  "name": "20260906-fix-post-detail-stale-tests",
  "type": "fix",
  "scope": "site",
  "status": "proposed",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "apps/site/test/post-detail-runtime-regression.test.mjs",
    "apps/site/test/post-typography-design-language.test.mjs"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# 修正博客详情两份过期测试断言

## 动机

`post-typography-design-language.test.mjs` 与 `post-detail-runtime-regression.test.mjs` 在 main 上早已失败：断言仍停留在已被迭代替换的旧设计（正文 p 14px/1.55、h2::before 竖线、hr 空心圆环、作者头像行 AuthorAvatarFrame），与当前实现（15.5px/1.85 书页排版、sec-eyebrow 眉线、hr 渐隐朱砂线、无头像行）不符，导致全套测试基线长期带红、掩盖真实回归。

## 引用规范

- norms/code-style-frontend.md（shadow-dev-workflow 通用）
  - 当前结论: 组件明确处理可见状态；测试与实现保持一致
  - 适用 scope: 前端
- shadow-docs/knowledge/blog-detail.md
  - 当前结论: 正文衬线 15.5px/1.85、h2/h3 朱砂眉线记号（sec-eyebrow + stub）、hr 两侧渐隐朱砂细线、页头不渲染作者头像行
  - 适用 scope: apps/site/app/post

## 决策

- **选型:** 将过期断言更新为匹配当前实现：p 度量正则、sec-eyebrow/stub 断言、hr 渐隐线断言、头像行断言改为 TagGroup 壳导出契约（PostHeader 与 styles 桶均含 TagGroup 且无 AuthorAvatarFrame）。
- **对比方案:** 删除两份测试——放弃：丢失排版语言与运行时契约的回归防护；回滚实现迁就断言——放弃：旧设计已被用户多轮否定。
- **理由:** 测试是设计的可执行文档，断言必须跟随已确认的当前设计；不改任何实现代码，纯测试修正。

## 任务

### Phase 1

- [x] 更新排版语言断言 — `apps/site/test/post-typography-design-language.test.mjs` — p 度量/sec-eyebrow/hr 渐隐线/标题块正则匹配当前 post-markdown.ts
- [x] 更新运行时回归断言 — `apps/site/test/post-detail-runtime-regression.test.mjs` — 头像行断言替换为 TagGroup 壳导出契约

## 结果

- 实际耗时: 0.3h
- 验证: 两份文件 12/12 绿；全套测试基线中这两份转绿；随 skeleton change 的验证一并跑过 oxlint/tsc

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 仅测试断言对齐既有 Knowledge 结论，未产生新长期事实
