# 技术方案

## OG / Twitter Card

在 `generateMetadata` 中加 `openGraph` 和 `twitter` 字段，Next.js 自动生成 `<meta>` 标签。

## 文章 description

优先用 metadata.summary，fallback 到 body 前 160 字符。

## JSON-LD

新建 `JsonLd` 组件，用 `<script type="application/ld+json">` 注入 BlogPosting schema。

## canonical

在 metadata 中加 `alternates.canonical` 字段。
