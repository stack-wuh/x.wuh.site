import { extractFirstImageUrl } from './content-cover.util';

describe('extractFirstImageUrl', () => {
  it('extracts the first html image src', () => {
    expect(
      extractFirstImageUrl(
        '<p>intro</p><img alt="cover" src="https://example.com/cover.png" /><img src="https://example.com/second.png" />',
        '![fallback](https://example.com/fallback.png)',
      ),
    ).toBe('https://example.com/cover.png');
  });

  it('supports single quoted and unquoted html image src values', () => {
    expect(extractFirstImageUrl("<img src='https://example.com/single.png'>")).toBe('https://example.com/single.png');
    expect(extractFirstImageUrl('<img src=https://example.com/unquoted.png>')).toBe('https://example.com/unquoted.png');
  });

  it('falls back to markdown image syntax', () => {
    expect(extractFirstImageUrl('', 'Text ![cover](https://example.com/markdown.png)')).toBe(
      'https://example.com/markdown.png',
    );
  });

  it('returns undefined when no image is present', () => {
    expect(extractFirstImageUrl('<p>no image</p>', 'plain text')).toBeUndefined();
  });
});
