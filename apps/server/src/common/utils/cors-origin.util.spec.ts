import { parseCorsOrigin } from './cors-origin.util';

describe('parseCorsOrigin', () => {
  it('keeps wildcard when no explicit origins are configured', () => {
    expect(parseCorsOrigin(undefined)).toBe('*');
    expect(parseCorsOrigin('')).toBe('*');
  });

  it('parses comma-separated origins for main site and console', () => {
    expect(parseCorsOrigin('http://localhost:3000,http://localhost:3300')).toEqual([
      'http://localhost:3000',
      'http://localhost:3300',
    ]);
  });

  it('trims blank values', () => {
    expect(parseCorsOrigin(' http://localhost:3000, ,http://localhost:3300 ')).toEqual([
      'http://localhost:3000',
      'http://localhost:3300',
    ]);
  });
});
