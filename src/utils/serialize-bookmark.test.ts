import {parseBookmark} from './parse-bookmark';
import {serializeBookmark} from './serialize-bookmark';

describe(`serializeBookmark()`, () => {
  it(`returns a string`, () => {
    const bookmark1 = `[foo](https://bar.baz) \`{"ctime":123}\``;

    expect(serializeBookmark(parseBookmark(bookmark1)!)).toBe(bookmark1);

    const bookmark2 = `[foo](https://bar.baz) \`{"ctime":123,"mtime":456,"clickCount":789}\``;

    expect(serializeBookmark(parseBookmark(bookmark2)!)).toBe(bookmark2);

    const bookmark3 = `[\\[\\[foo\\]\\]](https://bar.baz) \`{"ctime":123}\``;

    expect(serializeBookmark(parseBookmark(bookmark3)!)).toBe(bookmark3);

    expect(
      serializeBookmark({
        title: `  foo\n\n\nbar  baz `,
        url: `  https://bar.baz `,
        ctime: 123,
      }),
    ).toBe(`[foo bar baz](https://bar.baz) \`{"ctime":123}\``);
  });
});
