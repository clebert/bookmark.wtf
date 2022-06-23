import {parseBookmark} from './parse-bookmark.js';

describe(`parseBookmark()`, () => {
  it(`returns a bookmark`, () => {
    expect(parseBookmark(`[foo](https://bar.baz) \`{"ctime":123}\``)).toEqual({
      title: `foo`,
      url: `https://bar.baz`,
      ctime: 123,
    });

    expect(parseBookmark(`[ foo ](https://bar.baz) \`{"ctime":123}\``)).toEqual(
      {
        title: `foo`,
        url: `https://bar.baz`,
        ctime: 123,
      },
    );

    expect(
      parseBookmark(
        `[foo](https://bar.baz) \`{"ctime":123,"mtime":456,"clickCount":789}\``,
      ),
    ).toEqual({
      title: `foo`,
      url: `https://bar.baz`,
      ctime: 123,
      mtime: 456,
      clickCount: 789,
    });

    expect(
      parseBookmark(
        `[foo](https://bar.baz) \`{"ctime":123,"mtime":456,"unknown":789}\``,
      ),
    ).toEqual({
      title: `foo`,
      url: `https://bar.baz`,
      ctime: 123,
      mtime: 456,
    });

    expect(
      parseBookmark(`[\\[\\[foo\\]\\]](https://bar.baz) \`{"ctime":123}\``),
    ).toEqual({
      title: `[[foo]]`,
      url: `https://bar.baz`,
      ctime: 123,
    });
  });

  it(`returns undefined`, () => {
    expect(parseBookmark(`[foo](bar) \`{"ctime":123}\``)).toEqual(undefined);
    expect(parseBookmark(`[  ](bar) \`{"ctime":123}\``)).toEqual(undefined);
    expect(parseBookmark(``)).toBe(undefined);
    expect(parseBookmark(`[foo](https://bar.baz)`)).toBe(undefined);
    expect(parseBookmark(`\`{"ctime":123}\``)).toBe(undefined);

    expect(parseBookmark(`[foo](https://bar.baz)\`{"ctime":123}\``)).toBe(
      undefined,
    );

    expect(parseBookmark(`[foo](https://bar.baz) \`qux\``)).toBe(undefined);
    expect(parseBookmark(`[foo](https://bar.baz) \`{}\``)).toBe(undefined);

    expect(parseBookmark(`[foo](https://bar.baz) \`{"ctime":"123"}\``)).toEqual(
      undefined,
    );

    expect(
      parseBookmark(`[foo](https://bar.baz) \`{"ctime":123,"mtime":"456"}\``),
    ).toEqual(undefined);

    expect(
      parseBookmark(
        `[foo](https://bar.baz) \`{"ctime":123,"clickCount":"789"}\``,
      ),
    ).toEqual(undefined);
  });
});
