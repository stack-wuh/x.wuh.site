<!--
标题：<type>(<scope>): <subject> —— PR 合并时 GitHub 会自动追加 (#<PR>)，所以标题里不要自己写编号
  type ∈ build | feat | chore | style | docs | ui | fix | refactor | ci | test（小写，commitlint 枚举；表外类型禁止，也不新造）
  scope ∈ next | nest | components | hooks | config | shared-contracts | docs | ci（8 项，只表代码落点；deploy 已删——它是动作不是落点，部署链用 ci + subject 表达；表外一律不写，禁止 AI 自由推导）
  subject 单行 ≤ 50 字，不以句号结尾；整条标题 ≤ 100 字符；一个 PR 只装一种 type

正文：只允许 变更 / 影响 / 验证 / 关联 四段
  四段对所有 type 一律必需，不裁剪；确无内容也保留段落并写「- 无」
  单行 ≤ 100 字符；路径 / issue 编号 / 反引号代码 / brief 链接禁止被换行切断（反例：`完整\nbrief：…`）
  必须可追溯到 issue：无对应 issue 时先建 issue 再提 PR
  禁止 `Co-authored-by:` 等署名尾注；禁止在正文重复 PR 编号或标题

本文件由 shadow-dev-workflow 的 norms/pr-message.md + norms/templates/pr-body.md 生成，请勿手改。
-->

## 变更
- 

## 影响
- 行为/触发面变化：
- 明确不受影响的范围：

## 验证
- 命令与结果：
- 未覆盖项（明说，不留空白）：

## 关联
- Closes #
- brief: shadow-docs/changes/<slug>/brief.md
