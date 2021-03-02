import {SuccessfulReceiver} from 'loxia';
import {JSX, h} from 'preact';
import {useMemo} from 'preact/hooks';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useGistStore} from '../hooks/use-gist-store';
import {compareBookmarks} from '../models/compare-bookmarks';
import {parseBookmark} from '../models/parse-bookmark';
import {BookmarkControl} from './bookmark-control';
import {BookmarkFile, BookmarkItem} from './bookmark-item';
import {Grid} from './grid';
import {GridItem} from './grid-item';
import {Text} from './text';

export interface BookmarkListProps {
  readonly authStore: AuthorizedAuthStore;
  readonly userReceiver: SuccessfulReceiver<string>;
  readonly gistName: string;
}

export function BookmarkList({
  authStore,
  userReceiver,
  gistName,
}: BookmarkListProps): JSX.Element {
  const gistStore = useGistStore(authStore, userReceiver, gistName);

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

  return gistStore.state === 'loading' ? (
    <Grid>
      <GridItem row1={<Text static>Loading bookmarks...</Text>} />
    </Grid>
  ) : (
    <Grid>
      <BookmarkControl gistName={gistName} gistStore={gistStore} />

      {bookmarkFiles.map((bookmarkFile) => (
        <BookmarkItem
          key={bookmarkFile.filename}
          gistStore={gistStore}
          bookmarkFile={bookmarkFile}
        />
      ))}
    </Grid>
  );
}
