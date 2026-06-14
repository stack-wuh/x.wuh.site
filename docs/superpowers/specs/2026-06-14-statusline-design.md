# Statusline 设计

日期：2026-06-14

## 概述

为 Claude Code 配置底部状态栏（statusline），显示当前会话关键上下文信息。

## 布局

```
◇ sonnet   ⎇ feature/foo-143   ██████░░░░ 60%   ◷ 12m   ◆ x.wuh.site
```

分隔符：2 个空格。

## 信息项

| 图标 | 含义 | 数据来源 | 示例值 |
|------|------|----------|--------|
| `◇` | 当前模型 | Claude Code model | `sonnet` / `opus` / `haiku` |
| `⎇` | Git 分支 | `git branch --show-current` | `main`, `feat/xxx` |
| 进度条 | Token 用量 | Claude Code context | `████░░░░░░ 40%` |
| `◷` | 会话时长 | 会话计时器 | `12m` / `1h 23m` |
| `◆` | 项目名 | 当前目录 basename | `x.wuh.site` |

## Token 进度条

- 10 格 Unicode 块字符（已用 `█`，剩余 `░`）
- 后跟空格 + 百分比数字
- 颜色规则：
  - < 80%：绿色
  - 80 - 95%：黄色
  - > 95%：红色

示例：
- `████████░░ 82%`（黄色）
- `██████░░░░ 60%`（绿色）
- `█████████░ 95%`（红色）

## 会话时长

- < 60 分钟：`{n}m`（如 `12m`）
- >= 60 分钟：`{h}h {m}m`（如 `1h 23m`）

## 实现

通过 Claude Code 的 `statusLine` 配置项实现，使用 type: "string" 格式的模板字符串。
