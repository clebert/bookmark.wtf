import {BookmarkAdapter} from './bookmark';

describe('BookmarkAdapter', () => {
  const adapter = new BookmarkAdapter();

  describe('parse()', () => {
    it('returns a bookmark', () => {
      expect(adapter.parse('[foo](https://bar.baz) `{"ctime":123}`')).toEqual({
        title: 'foo',
        url: 'https://bar.baz',
        properties: {ctime: 123},
      });

      expect(
        adapter.parse(
          '[foo](https://bar.baz) `{"ctime":123,"mtime":456,"clickCount":789}`'
        )
      ).toEqual({
        title: 'foo',
        url: 'https://bar.baz',
        properties: {ctime: 123, mtime: 456, clickCount: 789},
      });

      expect(
        adapter.parse(
          '[foo](https://bar.baz) `{"ctime":123,"mtime":456,"unknown":789}`'
        )
      ).toEqual({
        title: 'foo',
        url: 'https://bar.baz',
        properties: {ctime: 123, mtime: 456},
      });

      expect(
        adapter.parse('[\\[\\["foo"\\]\\]](https://bar.baz) `{"ctime":123}`')
      ).toEqual({
        title: '[["foo"]]',
        url: 'https://bar.baz',
        properties: {ctime: 123},
      });
    });

    it('returns undefined', () => {
      expect(adapter.parse('')).toBe(undefined);
      expect(adapter.parse('[foo](https://bar.baz)')).toBe(undefined);
      expect(adapter.parse('`{"ctime":123}`')).toBe(undefined);

      expect(adapter.parse('[foo](https://bar.baz)`{"ctime":123}`')).toBe(
        undefined
      );

      expect(adapter.parse('[foo](https://bar.baz) `qux`')).toBe(undefined);
      expect(adapter.parse('[foo](https://bar.baz) `{}`')).toBe(undefined);

      expect(adapter.parse('[foo](https://bar.baz) `{"ctime":"123"}`')).toEqual(
        undefined
      );

      expect(
        adapter.parse('[foo](https://bar.baz) `{"ctime":123,"mtime":"456"}`')
      ).toEqual(undefined);

      expect(
        adapter.parse(
          '[foo](https://bar.baz) `{"ctime":123,"clickCount":"789"}`'
        )
      ).toEqual(undefined);
    });
  });

  describe('serialize()', () => {
    it('returns a string', () => {
      expect(
        adapter.serialize({
          title: 'foo',
          url: 'https://bar.baz',
          properties: {ctime: 123},
        })
      ).toBe('[foo](https://bar.baz) `{"ctime":123}`');

      expect(
        adapter.serialize({
          title: 'foo',
          url: 'https://bar.baz',
          properties: {ctime: 123, mtime: 456, clickCount: 789},
        })
      ).toBe(
        '[foo](https://bar.baz) `{"ctime":123,"mtime":456,"clickCount":789}`'
      );

      expect(
        adapter.serialize({
          title: '[["foo"]]',
          url: 'https://bar.baz',
          properties: {ctime: 123},
        })
      ).toBe('[\\[\\["foo"\\]\\]](https://bar.baz) `{"ctime":123}`');
    });
  });

  describe('compare()', () => {
    it('returns -1', () => {
      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 1}},
          {title: '', url: '', properties: {ctime: 0}}
        )
      ).toBe(-1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 2}},
          {title: '', url: '', properties: {ctime: 0, mtime: 1}}
        )
      ).toBe(-1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 0, mtime: 3}},
          {title: '', url: '', properties: {ctime: 1, mtime: 2}}
        )
      ).toBe(-1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 1}}
        )
      ).toBe(-1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 0, clickCount: 2}},
          {title: '', url: '', properties: {ctime: 1, clickCount: 1}}
        )
      ).toBe(-1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 1, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}}
        )
      ).toBe(-1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 0, mtime: 3, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 1, mtime: 2, clickCount: 1}}
        )
      ).toBe(-1);
    });

    it('returns 0', () => {
      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 1}},
          {title: '', url: '', properties: {ctime: 1}}
        )
      ).toBe(0);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 1}},
          {title: '', url: '', properties: {ctime: 0, mtime: 1}}
        )
      ).toBe(0);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 0, mtime: 2}},
          {title: '', url: '', properties: {ctime: 1, mtime: 2}}
        )
      ).toBe(0);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}}
        )
      ).toBe(0);
    });

    it('returns 1', () => {
      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 0}},
          {title: '', url: '', properties: {ctime: 1}}
        )
      ).toBe(1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 1}},
          {title: '', url: '', properties: {ctime: 0, mtime: 2}}
        )
      ).toBe(1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 1, mtime: 2}},
          {title: '', url: '', properties: {ctime: 0, mtime: 3}}
        )
      ).toBe(1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 1}},
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}}
        )
      ).toBe(1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 1, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 0, clickCount: 2}}
        )
      ).toBe(1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 1, clickCount: 1}}
        )
      ).toBe(1);

      expect(
        adapter.compare(
          {title: '', url: '', properties: {ctime: 1, mtime: 2, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 0, mtime: 3, clickCount: 1}}
        )
      ).toBe(1);
    });
  });
});
