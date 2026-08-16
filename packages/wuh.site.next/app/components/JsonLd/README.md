# JsonLd

JSON-LD 结构化数据脚本组件，用于向页面注入 SEO 结构化数据。

## 用法

```tsx
<JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: '标题' }} />
```

## 说明

- `data` 为结构化数据对象，内部用 `JSON.stringify` 序列化并注入到 `<script type="application/ld+json">`。
