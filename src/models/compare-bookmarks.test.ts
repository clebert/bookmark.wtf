import {compareBookmarks} from './compare-bookmarks';

describe('compareBookmarks()', () => {
  it('returns -1', () => {
    expect(compareBookmarks({ctime: 1}, {ctime: 0})).toBe(-1);
    expect(compareBookmarks({ctime: 2}, {ctime: 0, mtime: 1})).toBe(-1);

    expect(compareBookmarks({ctime: 0, mtime: 3}, {ctime: 1, mtime: 2})).toBe(
      -1
    );

    expect(compareBookmarks({ctime: 0, clickCount: 1}, {ctime: 1})).toBe(-1);

    expect(
      compareBookmarks({ctime: 0, clickCount: 2}, {ctime: 1, clickCount: 1})
    ).toBe(-1);

    expect(
      compareBookmarks({ctime: 1, clickCount: 1}, {ctime: 0, clickCount: 1})
    ).toBe(-1);

    expect(
      compareBookmarks(
        {ctime: 0, mtime: 3, clickCount: 1},
        {ctime: 1, mtime: 2, clickCount: 1}
      )
    ).toBe(-1);
  });

  it('returns 0', () => {
    expect(compareBookmarks({ctime: 1}, {ctime: 1})).toBe(0);
    expect(compareBookmarks({ctime: 1}, {ctime: 0, mtime: 1})).toBe(0);

    expect(compareBookmarks({ctime: 0, mtime: 2}, {ctime: 1, mtime: 2})).toBe(
      0
    );

    expect(
      compareBookmarks({ctime: 0, clickCount: 1}, {ctime: 0, clickCount: 1})
    ).toBe(0);
  });

  it('returns 1', () => {
    expect(compareBookmarks({ctime: 0}, {ctime: 1})).toBe(1);
    expect(compareBookmarks({ctime: 1}, {ctime: 0, mtime: 2})).toBe(1);

    expect(compareBookmarks({ctime: 1, mtime: 2}, {ctime: 0, mtime: 3})).toBe(
      1
    );

    expect(compareBookmarks({ctime: 1}, {ctime: 0, clickCount: 1})).toBe(1);

    expect(
      compareBookmarks({ctime: 1, clickCount: 1}, {ctime: 0, clickCount: 2})
    ).toBe(1);

    expect(
      compareBookmarks({ctime: 0, clickCount: 1}, {ctime: 1, clickCount: 1})
    ).toBe(1);

    expect(
      compareBookmarks(
        {ctime: 1, mtime: 2, clickCount: 1},
        {ctime: 0, mtime: 3, clickCount: 1}
      )
    ).toBe(1);
  });
});
