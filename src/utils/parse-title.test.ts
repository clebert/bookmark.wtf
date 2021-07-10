import {parseTitle} from './parse-title';

describe('parseTitle()', () => {
  it('returns a title', () => {
    const metaOgTitle = (content: string = '') =>
      `<meta property="og:title" ${content ? `content="${content}" ` : ''}/>`;

    const metaTitle = (content: string = '') =>
      `<meta name="title" ${content ? `content="${content}" ` : ''}/>`;

    const title = (content: string = '') => `<title>${content}</title>`;

    expect(
      parseTitle(metaOgTitle(' foo ') + metaTitle(' bar ') + title(' baz '))
    ).toBe('foo');

    expect(
      parseTitle(metaOgTitle(' ') + metaTitle(' bar ') + title(' baz '))
    ).toBe('bar');

    expect(
      parseTitle(metaOgTitle() + metaTitle(' bar ') + title(' baz '))
    ).toBe('bar');

    expect(parseTitle(metaTitle(' ') + title(' baz '))).toBe('baz');
    expect(parseTitle(metaTitle() + title(' baz '))).toBe('baz');
    expect(parseTitle(title(' '))).toBe('No title');
    expect(parseTitle(title())).toBe('No title');
    expect(parseTitle('oops')).toBe('No title');
    expect(parseTitle('')).toBe('No title');
  });
});
