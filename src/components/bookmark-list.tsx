import {JSX} from 'preact';
import {useEffect, useMemo} from 'preact/hooks';
import {AuthorizedAuthStore} from '../hooks/use-auth-store';
import {useGistStore} from '../hooks/use-gist-store';
import {AppHistory} from '../singletons/app-history';
import {AppStorage} from '../singletons/app-storage';
import {compareClickCount} from '../utils/compare-click-count';
import {compareTime} from '../utils/compare-time';
import {parseBookmark} from '../utils/parse-bookmark';
import {BookmarkControl} from './bookmark-control';
import {BookmarkFile, BookmarkItem} from './bookmark-item';
import {Grid} from './grid';

export interface BookmarkListProps {
  readonly authStore: AuthorizedAuthStore;
  readonly user: string;
  readonly gistName: string;
}

export function BookmarkList({
  authStore,
  user,
  gistName,
}: BookmarkListProps): JSX.Element | null {
  const gistStore = useGistStore(authStore, user, gistName);

  if (gistStore.state === 'failed') {
    throw gistStore.reason;
  }

  useEffect(() => {
    if ('gist' in gistStore) {
      const {description} = gistStore.gist;

      if (description) {
        document.title = description;
      }
    }

    return () => (document.title = 'bookmark.wtf');
  }, [gistStore]);

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

  const sortOrder = AppStorage.singleton.useSortOrder();

  const sortedBookmarkFiles = useMemo<readonly BookmarkFile[]>(
    () =>
      [...bookmarkFiles].sort(({bookmark: a}, {bookmark: b}) =>
        sortOrder === 'timeAsc'
          ? compareTime(a, b)
          : sortOrder === 'timeDesc'
          ? compareTime(b, a)
          : compareClickCount(b, a) || compareTime(b, a)
      ),
    [bookmarkFiles, sortOrder]
  );

  const searchValue = AppHistory.singleton.useSearch();

  const filteredBookmarkFiles = useMemo<readonly BookmarkFile[]>(() => {
    const regex = searchValue
      ? new RegExp(searchValue.split('').join('.?'), 'i')
      : undefined;

    return sortedBookmarkFiles.filter(
      ({bookmark}) =>
        !regex || regex.test(bookmark.title) || regex.test(bookmark.url)
    );
  }, [sortedBookmarkFiles, searchValue]);

  return gistStore.state !== 'loading' ? (
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
