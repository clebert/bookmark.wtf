import {BookmarkBackend} from './bookmark';

describe('BookmarkBackend', () => {
  const backend = new BookmarkBackend();

  describe('parseModel()', () => {
    it('returns a bookmark', () => {
      expect(
        backend.parseModel('[foo](https://bar.baz) `{"ctime":123}`')
      ).toEqual({
        title: 'foo',
        url: 'https://bar.baz',
        properties: {ctime: 123},
      });

      expect(
        backend.parseModel(
          '[foo](https://bar.baz) `{"ctime":123,"mtime":456,"clickCount":789}`'
        )
      ).toEqual({
        title: 'foo',
        url: 'https://bar.baz',
        properties: {ctime: 123, mtime: 456, clickCount: 789},
      });

      expect(
        backend.parseModel(
          '[foo](https://bar.baz) `{"ctime":123,"mtime":456,"unknown":789}`'
        )
      ).toEqual({
        title: 'foo',
        url: 'https://bar.baz',
        properties: {ctime: 123, mtime: 456},
      });

      expect(
        backend.parseModel(
          '[\\[\\["foo"\\]\\]](https://bar.baz) `{"ctime":123}`'
        )
      ).toEqual({
        title: '[["foo"]]',
        url: 'https://bar.baz',
        properties: {ctime: 123},
      });
    });

    it('returns undefined', () => {
      expect(backend.parseModel('')).toBe(undefined);
      expect(backend.parseModel('[foo](https://bar.baz)')).toBe(undefined);
      expect(backend.parseModel('`{"ctime":123}`')).toBe(undefined);

      expect(backend.parseModel('[foo](https://bar.baz)`{"ctime":123}`')).toBe(
        undefined
      );

      expect(backend.parseModel('[foo](https://bar.baz) `qux`')).toBe(
        undefined
      );

      expect(backend.parseModel('[foo](https://bar.baz) `{}`')).toBe(undefined);

      expect(
        backend.parseModel('[foo](https://bar.baz) `{"ctime":"123"}`')
      ).toEqual(undefined);

      expect(
        backend.parseModel(
          '[foo](https://bar.baz) `{"ctime":123,"mtime":"456"}`'
        )
      ).toEqual(undefined);

      expect(
        backend.parseModel(
          '[foo](https://bar.baz) `{"ctime":123,"clickCount":"789"}`'
        )
      ).toEqual(undefined);
    });
  });

  describe('serializeModel()', () => {
    it('returns a string', () => {
      expect(
        backend.serializeModel({
          title: 'foo',
          url: 'https://bar.baz',
          properties: {ctime: 123},
        })
      ).toBe('[foo](https://bar.baz) `{"ctime":123}`');

      expect(
        backend.serializeModel({
          title: 'foo',
          url: 'https://bar.baz',
          properties: {ctime: 123, mtime: 456, clickCount: 789},
        })
      ).toBe(
        '[foo](https://bar.baz) `{"ctime":123,"mtime":456,"clickCount":789}`'
      );

      expect(
        backend.serializeModel({
          title: '[["foo"]]',
          url: 'https://bar.baz',
          properties: {ctime: 123},
        })
      ).toBe('[\\[\\["foo"\\]\\]](https://bar.baz) `{"ctime":123}`');
    });
  });

  describe('compareModels()', () => {
    it('returns -1', () => {
      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 1}},
          {title: '', url: '', properties: {ctime: 0}}
        )
      ).toBe(-1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 2}},
          {title: '', url: '', properties: {ctime: 0, mtime: 1}}
        )
      ).toBe(-1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 0, mtime: 3}},
          {title: '', url: '', properties: {ctime: 1, mtime: 2}}
        )
      ).toBe(-1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 1}}
        )
      ).toBe(-1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 0, clickCount: 2}},
          {title: '', url: '', properties: {ctime: 1, clickCount: 1}}
        )
      ).toBe(-1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 1, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}}
        )
      ).toBe(-1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 0, mtime: 3, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 1, mtime: 2, clickCount: 1}}
        )
      ).toBe(-1);
    });

    it('returns 0', () => {
      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 1}},
          {title: '', url: '', properties: {ctime: 1}}
        )
      ).toBe(0);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 1}},
          {title: '', url: '', properties: {ctime: 0, mtime: 1}}
        )
      ).toBe(0);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 0, mtime: 2}},
          {title: '', url: '', properties: {ctime: 1, mtime: 2}}
        )
      ).toBe(0);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}}
        )
      ).toBe(0);
    });

    it('returns 1', () => {
      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 0}},
          {title: '', url: '', properties: {ctime: 1}}
        )
      ).toBe(1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 1}},
          {title: '', url: '', properties: {ctime: 0, mtime: 2}}
        )
      ).toBe(1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 1, mtime: 2}},
          {title: '', url: '', properties: {ctime: 0, mtime: 3}}
        )
      ).toBe(1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 1}},
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}}
        )
      ).toBe(1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 1, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 0, clickCount: 2}}
        )
      ).toBe(1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 0, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 1, clickCount: 1}}
        )
      ).toBe(1);

      expect(
        backend.compareModels(
          {title: '', url: '', properties: {ctime: 1, mtime: 2, clickCount: 1}},
          {title: '', url: '', properties: {ctime: 0, mtime: 3, clickCount: 1}}
        )
      ).toBe(1);
    });
  });
});
