import { parseIssueMetadata, stripIssueMetadata } from './content-metadata.util';

describe('issue metadata utilities', () => {
  const source =
    '<!-- wuh-site-metadata: {"cover":"https://cdn.wuh.site/covers/example.jpg","coverAlt":"书桌上的笔记本电脑"} -->\n\n# 正文';

  it('parses a valid hidden metadata comment', () => {
    expect(parseIssueMetadata(source)).toEqual({
      cover: 'https://cdn.wuh.site/covers/example.jpg',
      coverAlt: '书桌上的笔记本电脑',
    });
  });

  it('only strips valid metadata comments', () => {
    expect(stripIssueMetadata(source)).toBe('# 正文');

    const invalid = '<!-- wuh-site-metadata: {not-json} -->\n\n# 正文';
    expect(parseIssueMetadata(invalid)).toBeNull();
    expect(stripIssueMetadata(invalid)).toBe(invalid);
  });
});
