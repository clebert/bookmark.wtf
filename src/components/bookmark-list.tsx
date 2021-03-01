import {JSX, h} from 'preact';
import {useMemo} from 'preact/hooks';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useGistStore} from '../hooks/use-gist-store';
import {compareBookmarks} from '../models/compare-bookmarks';
import {parseBookmark} from '../models/parse-bookmark';
import {BookmarkControl} from './bookmark-control';
import {BookmarkFile, BookmarkItem} from './bookmark-item';
import {Grid} from './grid';

export interface BookmarkListProps {
  readonly authStore: AuthorizedAuthStore;
  readonly gistName: string;
  readonly user: string;
}

export function BookmarkList({
  authStore,
  gistName,
  user,
}: BookmarkListProps): JSX.Element {
  const gistStore = useGistStore(authStore.token, gistName, user);

  if (gistStore.state === 'failed') {
    throw gistStore.reason;
  }

  const bookmarkFiles: readonly BookmarkFile[] = useMemo(
    () =>
      (gistStore.gist?.files ?? [])
        .reduce((accu, {filename, text}) => {
          const bookmark = parseBookmark(text);

          return bookmark ? [{filename, bookmark}, ...accu] : accu;
        }, [] as BookmarkFile[])
        .sort((a, b) => compareBookmarks(a.bookmark, b.bookmark)),
    [gistStore]
  );

  return (
    <Grid>
      <BookmarkControl gistName={gistName} gistStore={gistStore} />

      {gistStore.state !== 'loading' &&
        bookmarkFiles.map((bookmarkFile) => (
          <BookmarkItem
            key={bookmarkFile.filename}
            gistStore={gistStore}
            bookmarkFile={bookmarkFile}
          />
        ))}
    </Grid>
  );
}
