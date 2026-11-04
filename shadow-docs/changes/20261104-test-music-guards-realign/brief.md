---
{
  "schema": "shadow-dev/v1",
  "name": "20261104-test-music-guards-realign",
  "type": "test",
  "scope": "site",
  "status": "published",
  "baseBranch": "main",
  "branch": "test/20261104-test-music-guards-realign",
  "files": [
    "apps/site/test/music-player-wiring.test.mjs"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 570,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/570"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "6b41f7e406ce916845bb45e09916905b9a671ce3",
    "verifiedAt": "2026-11-04T15:15:29.137Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:570",
    "planHash": "cb8eaa0667cfea32ed494f93ec4d6c9312eb6659d14e85fdb06461190c94041b",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "apps/site/test/music-player-wiring.test.mjs",
        "shadow-docs/changes/20261104-test-music-guards-realign/brief.md"
      ],
      "message": "test(site): music 移动端守卫对齐 responsive 发射形态",
      "title": "test(site): music 移动端守卫对齐 responsive 发射形态",
      "body": "## 变更\n- music-player-wiring 三条长期红守卫对齐现势实现：刻度带渐隐 mask、TrackSide contents↔grid 溶入、PlayingSlot 移动隐藏 + 54px 触控目标断言全部改为 responsive() 发射形态\n- 纯测试变更，零代码改动\n\n## 影响\n- 行为/触发面变化：无——只修断言形态，语义与被测代码均不变\n- 明确不受影响的范围：站点代码、守卫语义、CI 门禁口径均不变\n\n## 验证\n- 命令与结果：node --test apps/site/test/music-player-wiring.test.mjs 13/13 全绿（修复前 3 红，归因 20261015 移动端改版把字面 CSS 声明迁移 responsive() 后旧正则失配）\n- 未覆盖项（明说，不留空白）：无——纯测试文件变更，不触 tsc/build 门\n\n## 关联\n- brief: shadow-docs/changes/20261104-test-music-guards-realign/brief.md"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "S 级纯测试断言对齐：三条失配正则改为 responsive() 发射形态，断言语义不变（mask 渐隐/contents 溶入/移动隐藏/54px 触控目标全数在场），13/13 全绿；music-player 卡 20261015 段已如实记录该形态，无新长期事实"
  }
}
---

# music 移动端守卫对齐现势实现（三条长期红修复）

## 动机

main 上 `music-player-wiring.test.mjs` 三条守卫长期红：20261015-style-player-mobile-affordance 把字面 CSS 声明迁移到 `responsive()` 助手发射（字面形态 → 模板字符串），旧正则只认字面形态随即失配。长期红让门禁失去信号价值——新回归混在既有红里无法区分（本次换幕变更验证期即被迫逐条归因基线）。语义全部健在：两端渐隐 mask（styles.ts:110 responsive 模板 + 渐变串）、TrackSide contents↔grid 溶入（styles.ts:631 `responsive(['grid', undefined, 'contents'])`）、PlayingSlot 移动隐藏（styles.ts:523 `responsive(['none', undefined, 'inline-flex'])`）、54px 触控目标（styles.ts:431 `responsive(['54px', undefined, 'unset'])`）。

## 复杂度评级

- **评级:** S
- **理由:** 纯测试断言对齐现势实现，零代码变更、零契约变更；可发现性低（断言红即失败）。
- **期望验证深度:** code-read + 守卫套件全绿
- **取证策略:** observation

## 任务

### Phase 1
- [x] task 1 — `apps/site/test/music-player-wiring.test.mjs` — 三条失配断言改为 responsive 发射形态：① 刻度带 mask 断言 responsive 模板与渐变串在场；② TrackSide 断言 `responsive(['grid', undefined, 'contents'])` 溶入语义；③ PlayingSlot 断言 `responsive(['none', undefined, 'inline-flex'])` + TrackButton 54px 触控目标 `responsive(['54px', undefined, 'unset'])`
- [x] task 2 — 验证：`node --test apps/site/test/music-player-wiring.test.mjs` 全绿（13/13），根 tsc 无涉（纯测试）

## 结果

- 实际耗时: 约 20 分钟
- 验证: `node --test apps/site/test/music-player-wiring.test.mjs` 13/13 全绿（修复前 3 红归因 20261015 responsive 迁移后的旧正则失配，语义全数健在）；纯测试变更不触 tsc/build 门

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 守卫对齐不改任何语义；music-player 卡 20261015 段已如实记录移动端形态（页缘钮点号化/词窗三态），守卫失配属该次改版遗漏的断言跟进，不产生新长期事实。
