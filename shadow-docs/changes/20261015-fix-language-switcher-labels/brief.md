---
{
  "schema": "shadow-dev/v1",
  "name": "20261015-fix-language-switcher-labels",
  "type": "fix",
  "scope": "site",
  "status": "published",
  "baseBranch": "main",
  "branch": "fix/20261015-fix-language-switcher-labels",
  "files": [
    "apps/site/app/components/SiteHeader/AppearanceOptions.tsx",
    "apps/site/app/components/SiteHeader/styles/index.ts"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 547,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/547"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "99558f9732b02c44ba61c72bc0572acfc7777cd7",
    "verifiedAt": "2026-10-15T12:43:47.825Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:547",
    "planHash": "f08a12fcf9aa11a4a0eb8759749d76f7002c57b5191bbca94707eeb61c6abff8",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "apps/site/app/components/SiteHeader/AppearanceOptions.tsx",
        "apps/site/app/components/SiteHeader/styles/index.ts"
      ],
      "message": "fix(site): 语言切换标签改为中/EN/日本語自称",
      "title": "fix(site): 语言切换标签改为中/EN/日本語自称",
      "body": "## 变更内容\n\n设置弹层「语言」分段标签由单字自称「中｜英｜日」改为可辨识自称「中｜EN｜日本語」（#快速修复，用户截图反馈单字辨识度不足）。\n\n- `apps/site/app/components/SiteHeader/AppearanceOptions.tsx`：`LANGUAGE_OPTIONS` 三个 label 常量改写 + 注释同步\n- `apps/site/app/components/SiteHeader/styles/index.ts`：语言分段注释同步（纯注释）\n\n## 验证\n\n- **S 级展示层**：用户截图即复现观察（渲染「中/英/日」与期望不符）\n- site 域 tsc：35 条全为存量基线（与知识卡 35=35 持平），触及文件零命中\n- dev server 渲染目检（field）：弹层语言分段实证为 **中（选中态）｜ EN ｜ 日本語**，三等分 grid 无溢出、无换行，明暗两态正常\n\n## 说明\n\n日语标签按自称正字法取「日本語」（日语写法）；三标签仍为跨语言不变量，不进词典。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "S 级展示层文案修复：diff 仅 LANGUAGE_OPTIONS 三个 label 常量与两处注释；site 域 tsc 35 条全为存量（触及文件零命中），dev server 渲染目检语言分段为中/EN/日本語、三等分无溢出"
  }
}
---

# 语言切换标签改为可辨识自称：中 / EN / 日本語

## 现象与影响
设置弹层「语言」分段三标签显示为单字自称「中｜英｜日」，单字「英/日」辨识度不足（用户截图反馈，20261015）。影响全站桌面与移动端设置弹层的语言分段展示；纯展示层，无功能影响。

## 复杂度评级
- **评级:** S
- **理由:** 文案/展示层常量改写，零行为触及（LANGUAGE_OPTIONS 静态数组 label 字段）
- **期望验证深度:** code-read + field 目检

## 根因与修复
根因：`apps/site/app/components/SiteHeader/AppearanceOptions.tsx` 的 `LANGUAGE_OPTIONS` 硬编码单字自称「中/英/日」。修复：label 改为中 / EN / 日本語（日语自称按正字法用「日本語」，用户原话「日本语」为简体转写），同步修正两处注释（组件内 + styles/index.ts 语言分段注）。

## 引用规范
- knowledge/bug-investigation.md
  - 当前结论: 复现→追踪→根因→最小修复→回归由单一上下文完成
  - 适用 scope: cross-project

## 任务
### Phase 1
- [x] 取不变量被破坏的观察 — 用户截图即观察记录：语言分段渲染「中/英/日」，与用户期望（中/EN/日本语）不符，标签可辨识性被破坏 — S 级以观察记录复现
- [x] 修复并回归 — `apps/site/app/components/SiteHeader/AppearanceOptions.tsx` + `apps/site/app/components/SiteHeader/styles/index.ts` — label 常量改写 + 注释同步；复验：代码观察渲染标签为中/EN/日本語，site 域 tsc 无新增

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 无需变更（一次性文案修复）
- **候选卡片:** 无
- **理由:** 一次性修复过程不入 Knowledge
