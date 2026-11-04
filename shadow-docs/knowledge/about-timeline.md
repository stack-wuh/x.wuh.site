---
title: About 最近日志时间线
domain: about
keywords: [About页, 最近日志, 时间线, Timeline, 跨平台动态, provider, 部分降级, 豆瓣, GitHub Events, TimelineEntry]
scope:
  - apps/server/src/modules/about-timeline
  - packages/core/src/about-timeline.dto.ts
  - apps/site/app/about
status: active
source:
  - changes/archive/20261104-feature-about-recent-logs/brief.md
verified: 2026-11-04
verified-depth: runtime
verified-scope: 本地 dist 实跑 `GET /v2/about/timeline`：四源聚合 29 条真实条目、结构断言 12/12（降序/字段完整/无 # 占位/枚举合法/id 唯一）、api-v2 清单含 timeline；豆瓣双 feed 均指向不可达地址时 HTTP 200 且 sources 标 douban ok=false、其余三源 18 条照常（部分降级实取）。豆瓣「单 feed 挂保另一 feed」分支与 post-fix runtime 复验仅 unit 级（tsc+build 绿），runtime 复验转 CI。
---

# About 最近日志时间线

## 当前结论

「最近日志」由 `GET /v2/about/timeline` 聚合四个 provider（site/github/douban/weread）输出统一 `TimelineEntry`（platform/category/title/link/timestamp），条目按 timestamp 降序、上限 50 条、10 分钟内存缓存。About 页客户端 fetch（经 `/api` rewrite）渲染并接 90d/180d/今年筛选，空态用 Empty。

**部分降级契约**：单 provider 失败不整体 5xx，响应 `sources` 数组暴露各源 ok/count；该语义与热力图「任一必要源失败返回明确错误」有意区分——热力图是统计契约，timeline 是日志流。条目 link 禁 `#` 占位，无真实深链用平台主页兜底（微信读书用书架主页，bookId 转 web 深链不可靠）。

**各源映射**：site=content 库 publishedAt（博客发布）+ comment 库（留言，标题取正文首行截断）；github=ReleaseEvent+CreateEvent(repository)，PushEvent/WatchEvent/IssuesEvent 排除（push 噪音大，博客发布走库更可靠）；douban=interests+notes 双 RSS（单 feed 失败保留另一 feed 条目，双挂才判源失败，feed 地址可经 `DOUBAN_INTERESTS_FEED`/`DOUBAN_NOTES_FEED` 覆盖）；weread=books 按 readUpdateTime（秒级时间戳）映射在读/读完。

**插拔约定**：新增平台源 = 新增 provider 类 + module 注册 + 扩 `TIMELINE_PLATFORMS`/`TIMELINE_CATEGORIES` 枚举 + 前端 i18n category 文案，聚合层逻辑与筛选器不改（Twitter 由此留口未接：免费层读不到时间线，付费路径不为个人模块引入）。

## 执行约束

- provider 是反腐边界：外部原始结构（GitHub event、RSS item、mongoose 文档）不得透出聚合层，必须映射为字段完整的 `TimelineEntry`。
- 聚合规则、枚举、降级语义为前后端契约，改动须同步 `packages/core` DTO 与 About 前端；不得重新拼接 `/v2/v2` 路径。
- 豆瓣抓取必须带浏览器 UA（无 UA 被风控），rss-parser timeout 10s。

## 适用边界

只约束「最近日志」时间线接口与 About 页 Timeline 区块，不约束综合热力图（about-activity）与 GitHub contributions 独立展示。

## 验证方式

检查 about-timeline 模块 sanitize（降序/字段完整/无 `#`）与 provider 降级分支；本地起服后 `curl /v2/about/timeline` 断言 sources 状态与条目结构；豆瓣降级用 env 指向不可达地址构造。

## 关联知识

- [about activity](./about-activity.md)
- [about code structure](./about-code-structure.md)
