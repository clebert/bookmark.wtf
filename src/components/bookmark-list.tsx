import {SuccessfulReceiver} from 'loxia';
import {JSX, h} from 'preact';
import {useMemo} from 'preact/hooks';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useBookmarkSort} from '../hooks/use-bookmark-sort';
import {useGistStore} from '../hooks/use-gist-store';
import {useSearchTerm} from '../hooks/use-search-term';
import {useToggle} from '../hooks/use-toggle';
import {parseBookmark} from '../models/parse-bookmark';
import {BookmarkControl} from './bookmark-control';
import {BookmarkFile, BookmarkItem} from './bookmark-item';
import {Grid} from './grid';

export interface BookmarkListProps {
  readonly authStore: AuthorizedAuthStore;
  readonly userReceiver: SuccessfulReceiver<string>;
  readonly gistName: string;
}

export function BookmarkList({
  authStore,
  userReceiver,
  gistName,
}: BookmarkListProps): JSX.Element | null {
  const gistStore = useGistStore(authStore, userReceiver, gistName);

  if (gistStore.state === 'failed') {
    throw gistStore.reason;
  }

  const bookmarkFiles = useMemo<readonly BookmarkFile[]>(
    () =>
      ('gist' in gistStore ? gistStore.gist.files : []).reduce(
        (files, {filename, text}) => {
          const bookmark = parseBookmark(text);

          return !bookmark ? files : [{filename, bookmark}, ...files];
        },
        [] as BookmarkFile[]
      ),
    [gistStore]
  );

  const bookmarkSort = useBookmarkSort();

  const sortedBookmarkFiles = useMemo<readonly BookmarkFile[]>(
    () =>
      [...bookmarkFiles].sort(({bookmark: a}, {bookmark: b}) =>
        bookmarkSort.compare(a, b)
      ),
    [bookmarkFiles, bookmarkSort]
  );

  const {regex} = useSearchTerm();

  const filteredBookmarkFiles = useMemo<readonly BookmarkFile[]>(
    () =>
      sortedBookmarkFiles.filter(
        ({bookmark}) =>
          !regex || regex.test(bookmark.title) || regex.test(bookmark.url)
      ),
    [sortedBookmarkFiles, regex]
  );

  const [zenMode, toggleZenMode] = useToggle(true);

  return gistStore.state !== 'loading' ? (
    <Grid>
      <BookmarkControl
        gistName={gistName}
        gistStore={gistStore}
        sortOrder={bookmarkSort.sortOrder}
        zenMode={zenMode}
        onChangeSortOrder={
          filteredBookmarkFiles.length > 0
            ? bookmarkSort.changeSortOrder
            : undefined
        }
        onChangeZenMode={
          filteredBookmarkFiles.length > 0 ? toggleZenMode : undefined
        }
      />

      {filteredBookmarkFiles.map((bookmarkFile) => (
        <BookmarkItem
          key={bookmarkFile.filename}
          gistStore={gistStore}
          bookmarkFile={bookmarkFile}
          zenMode={zenMode}
        />
      ))}
    </Grid>
  ) : null;
}
