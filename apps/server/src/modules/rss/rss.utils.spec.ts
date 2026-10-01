import { rssCopyright, rssDescription, stripMarkdownToText } from './rss.utils';

describe('rss feed utilities', () => {
  describe('stripMarkdownToText', () => {
    it('strips headings, images, links, emphasis, quotes and list markers', () => {
      const markdown = [
        '## 再读《坐忘歌》',
        '',
        '![cover](https://cdn.wuh.site/cover.png)',
        '',
        '> 常默元气不伤',
        '',
        '- 要点一',
        '* 要点二',
        '',
        '**加粗**与_斜体_以及`行内代码`',
        '[链接文字](https://example.com)',
      ].join('\n');

      const text = stripMarkdownToText(markdown);

      expect(text).not.toMatch(/##/);
      expect(text).not.toMatch(/!\[/);
      expect(text).not.toMatch(/\]\(http/);
      expect(text).not.toMatch(/\*\*/);
      expect(text).not.toMatch(/^[-*]\s/m);
      expect(text).toContain('再读《坐忘歌》');
      expect(text).toContain('cover');
      expect(text).toContain('常默元气不伤');
      expect(text).toContain('加粗与斜体以及行内代码');
      expect(text).toContain('链接文字');
    });

    it('removes fenced code blocks entirely and collapses whitespace', () => {
      const markdown = '正文前\n\n```ts\nconst x = 1;\n```\n\n正文后   多空格';

      const text = stripMarkdownToText(markdown);

      expect(text).not.toContain('const x');
      expect(text).toBe('正文前 正文后 多空格');
    });

    it('truncates to the requested length', () => {
      expect(stripMarkdownToText('一二三四五六七八九十', 5)).toBe('一二三四五');
    });
  });

  describe('rssDescription', () => {
    it('prefers the cms summary verbatim', () => {
      const content = {
        metadata: { summary: '这是 CMS 摘要' },
        body: '## 正文原始 Markdown',
      };

      expect(rssDescription(content)).toBe('这是 CMS 摘要');
    });

    it('falls back to stripped body text truncated at 200 chars', () => {
      const content = {
        metadata: {},
        body: `## 标题\n\n${'很长的正文'.repeat(60)}`,
      };

      const text = rssDescription(content);

      expect(text).not.toMatch(/##/);
      expect(text.length).toBeLessThanOrEqual(200);
      expect(text.startsWith('标题')).toBe(true);
    });

    it('returns empty string when neither summary nor body exists', () => {
      expect(rssDescription({})).toBe('');
    });
  });

  describe('rssCopyright', () => {
    it('renders a year range for years after 2021', () => {
      expect(rssCopyright(2026)).toBe('© 2021–2026 wuh.site');
    });

    it('renders the founding year only', () => {
      expect(rssCopyright(2021)).toBe('© 2021 wuh.site');
    });
  });
});
