type RssContentLike = {
  metadata?: { summary?: string | null } | null;
  body?: string | null;
};

/**
 * Markdown 转纯文本：去代码块/图片/链接/标题/引用/强调/列表标记后压缩空白。
 * RSS description 需要纯文本——原始 Markdown 在阅读器里以 `##`、`![]()` 字面量呈现。
 */
export function stripMarkdownToText(markdown: string, maxLength?: number): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  return typeof maxLength === 'number' ? text.slice(0, maxLength) : text;
}

/** description 降级顺序与站点侧一致：CMS summary 优先，缺失时剥离 Markdown 后截断 200 字 */
export function rssDescription(content: RssContentLike): string {
  const summary = content.metadata?.summary?.trim();
  if (summary) return summary;

  return content.body ? stripMarkdownToText(content.body, 200) : '';
}

/** 版权年份与页脚 copyrightYears 语义一致：建站 2021 起到当前年 */
export function rssCopyright(year = new Date().getFullYear()): string {
  return year > 2021 ? `© 2021–${year} wuh.site` : '© 2021 wuh.site';
}
