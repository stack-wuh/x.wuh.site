---
{
  "schema": "shadow-dev/v1",
  "name": "20261109-docs-registry-knowledge",
  "type": "docs",
  "scope": "shadow-docs",
  "status": "committed",
  "baseBranch": "main",
  "branch": "docs/20261109-docs-registry-knowledge",
  "files": [
    "shadow-docs/knowledge/build-config.md"
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
    "checkpoint": "0eb078ade08da20e1ba21b2f73cc5bf7e42be2d8",
    "planHash": "f64c4c3337817c17358ddd8238127faf15997bcf3d4094afdd30cc8573dead7c",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "shadow-docs/knowledge/build-config.md"
      ],
      "message": "docs(shadow): registry 策略行入 build-config 卡（#580 知识闭环尾单）"
    }
  }
}
---

# registry 策略落卡（#580 知识闭环尾单）

## 动机
PR #580（CI registry 解钉）review 承诺「更新 build-config.md」，随归档先行落地；本单补写卡更新并闭环。

## 复杂度评级
- **评级:** S
- **理由:** 单卡单段知识写入。
- **期望验证深度:** code-read
- **取证策略:** observation

## 领域模型
- **限界上下文:** 工程基建（流程治理）——CI 依赖源策略入卡。
- **被触及的既有不变量:** build-config.md CI 触发策略段语义不变，仅前置依赖源行。

## 引用规范
- shadow-docs/knowledge/build-config.md
  - 当前结论: CI registry 策略（runner 海外走官方源）+ 触发策略
  - 适用 scope: .github/workflows、.npmrc

## 决策
- **选型:** CI 段前置依赖源策略行（含动因与作用域边界）。
- **对比方案:** 独立新卡（粒度不配——单策略行归 build-config 天然归属）。
- **理由:** 策略属构建链契约，卡已有 CI 触发策略段，就近补行。

## 任务
### Phase 1
- [ ] task 1 — `shadow-docs/knowledge/build-config.md` — CI 段前置 registry 策略行

## 结果
- 实际耗时: 5 分钟
- 验证: 行内容与 #580 实施一致；main CI（aa2c4ad）新 env 首跑绿为佐证

## 知识评估
- **预期影响:** 更新（本次即本体）
- **候选卡片:** build-config.md
- **理由:** 知识写入本体。
