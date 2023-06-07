import type {BookmarkFile} from './bookmark-item.js';
import type {AuthorizedAuthStore} from '../hooks/use-auth-store.js';

import {BookmarkControl} from './bookmark-control.js';
import {BookmarkItem} from './bookmark-item.js';
import {Grid} from './grid.js';
import {useGistStore} from '../hooks/use-gist-store.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import {compareClickCount} from '../utils/compare-click-count.js';
import {compareTime} from '../utils/compare-time.js';
import {parseBookmark} from '../utils/parse-bookmark.js';
import * as React from 'react';

export interface BookmarkListProps {
  authStore: AuthorizedAuthStore;
  user: string;
  gistName: string;
}

export function BookmarkList({
  authStore,
  user,
  gistName,
}: BookmarkListProps): JSX.Element | null {
  const gistStore = useGistStore(authStore, user, gistName);

  if (gistStore.state === `failed`) {
    throw gistStore.reason;
  }

  React.useEffect(() => {
    if (`gist` in gistStore) {
      const {description} = gistStore.gist;

      if (description) {
        document.title = description;
      }
    }

    return () => {
      document.title = `bookmark.wtf`;
    };
  }, [gistStore]);

  const bookmarkFiles = React.useMemo<readonly BookmarkFile[]>(
    () =>
      (`gist` in gistStore ? gistStore.gist.files : []).reduce(
        (files, {filename, text}) => {
          const bookmark = parseBookmark(text);

          return !bookmark ? files : [{filename, bookmark}, ...files];
        },
        [] as BookmarkFile[],
      ),
    [gistStore],
  );

  const sortOrder = AppTopics.sortOrder.use();

  const sortedBookmarkFiles = React.useMemo<readonly BookmarkFile[]>(
    () =>
      [...bookmarkFiles].sort(({bookmark: a}, {bookmark: b}) =>
        sortOrder === `timeAsc`
          ? compareTime(a, b)
          : sortOrder === `timeDesc`
          ? compareTime(b, a)
          : compareClickCount(b, a) || compareTime(b, a),
      ),
    [bookmarkFiles, sortOrder],
  );

  const searchTerm = AppTopics.searchTerm.use();

  const filteredBookmarkFiles = React.useMemo<readonly BookmarkFile[]>(() => {
    const regex = searchTerm
      ? new RegExp(searchTerm.split(``).join(`.?`), `i`)
      : undefined;

    return sortedBookmarkFiles.filter(
      ({bookmark}) =>
        !regex || regex.test(bookmark.title) || regex.test(bookmark.url),
    );
  }, [sortedBookmarkFiles, searchTerm]);

  return gistStore.state !== `loading` ? (
    <Grid>
      <BookmarkControl gistName={gistName} gistStore={gistStore} />

      {filteredBookmarkFiles.map((bookmarkFile) => (
        <BookmarkItem
          key={bookmarkFile.filename}
          gistStore={gistStore}
          bookmarkFile={bookmarkFile}
        />
      ))}
    </Grid>
  ) : null;
}
