import {parseGistName} from './parse-gist-name';

describe('parseGistName()', () => {
  it('returns a gist name', () => {
    expect(parseGistName('https://gist.github.com/a/b')).toBe('b');
    expect(parseGistName('gist.github.com/a/b')).toBe('b');
    expect(parseGistName('https://gist.github.com/a')).toBe('a');
    expect(parseGistName('gist.github.com/a')).toBe('a');
    expect(parseGistName('https://bookmark.wtf/a')).toBe('a');
    expect(parseGistName('bookmark.wtf/a')).toBe('a');
  });

  it('returns undefined', () => {
    expect(parseGistName('')).toBe(undefined);
    expect(parseGistName('a')).toBe(undefined);
    expect(parseGistName('https://gist.github.com/a/b/c')).toBe(undefined);
    expect(parseGistName('gist.github.com/a/b/c')).toBe(undefined);
    expect(parseGistName('https://gist.github.com/')).toBe(undefined);
    expect(parseGistName('gist.github.com/')).toBe(undefined);
    expect(parseGistName('https://gist.github.com')).toBe(undefined);
    expect(parseGistName('gist.github.com')).toBe(undefined);
    expect(parseGistName('https://bookmark.wtf/a/b')).toBe(undefined);
    expect(parseGistName('bookmark.wtf/a/b')).toBe(undefined);
    expect(parseGistName('https://bookmark.wtf/')).toBe(undefined);
    expect(parseGistName('bookmark.wtf/')).toBe(undefined);
    expect(parseGistName('https://bookmark.wtf')).toBe(undefined);
    expect(parseGistName('bookmark.wtf')).toBe(undefined);
  });
});
