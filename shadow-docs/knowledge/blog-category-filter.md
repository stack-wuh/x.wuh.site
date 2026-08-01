---
keywords: [博客分类, 标签筛选, labels, 过滤条, 分页联动, AND语义]
---

# 博客分类筛选

博客列表支持按 labels 分类筛选，URL 格式为 `/blog?labels=<label>`。多标签使用 AND 语义（仅展示同时包含全部已选标签的文章），URL 为 `/blog?labels=a&labels=b`。筛选状态可通过 URL 分享，服务端渲染时保留全部查询参数。

分类入口展示 open 状态博客的标签汇总，每个标签格式为 `label(+count)`。已选外部 token 只展示标签名。筛选与分页联动：翻页保留 labels 参数，切换分类重置分页到第 1 页。多个筛选 token 可单独移除，最后一个 token 移除后回到 `/blog`。

过滤条使用 GitHub Issues 风格，背景、hover、token 状态与站点主题色一致，不展示结果提示文案。
