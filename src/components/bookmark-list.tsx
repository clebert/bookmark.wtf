import type {BookmarkFile} from './bookmark-item.js';
import type {appMachine} from '../machines/app-machine.js';
import type {InferSnapshot} from 'state-guard';

import {BookmarkControl} from './bookmark-control.js';
import {BookmarkItem} from './bookmark-item.js';
import {Grid} from './grid.js';
import {sortOrderMachine} from '../machines/sort-order-machine.js';
import {compareClickCount} from '../utils/compare-click-count.js';
import {compareTime} from '../utils/compare-time.js';
import {parseBookmark} from '../utils/parse-bookmark.js';
import * as React from 'react';

export interface BookmarkListProps {
  appSnapshot: InferSnapshot<
    typeof appMachine,
    'hasGist' | 'isUpdatingGist' | 'hasForeignGist' | 'isForkingGist'
  >;
}

export function BookmarkList({appSnapshot}: BookmarkListProps): JSX.Element | null {
  const {gist} = appSnapshot.value;

  React.useEffect(() => {
    if (appSnapshot.state === `hasGist`) {
      if (gist.description) {
        document.title = gist.description;
      }
    }

    return () => {
      document.title = `bookmark.wtf`;
    };
  }, [appSnapshot]);

  const sortOrderSnapshot = React.useSyncExternalStore(sortOrderMachine.subscribe, () =>
    sortOrderMachine.get(),
  );

  const bookmarkFiles = React.useMemo(
    () =>
      Object.entries(gist.files)
        .reduce<BookmarkFile[]>((files, [filename, {content}]) => {
          const bookmark = parseBookmark(content);

          return !bookmark ? files : [{filename, bookmark}, ...files];
        }, [])
        .sort(({bookmark: a}, {bookmark: b}) =>
          sortOrderSnapshot.state === `isTimeAsc`
            ? compareTime(a, b)
            : sortOrderSnapshot.state === `isTimeDesc`
            ? compareTime(b, a)
            : compareClickCount(b, a) || compareTime(b, a),
        ),
    [appSnapshot, sortOrderSnapshot],
  );

  return (
    <Grid>
      <BookmarkControl appSnapshot={appSnapshot} />

      {bookmarkFiles.map((bookmarkFile) => (
        <BookmarkItem
          key={bookmarkFile.filename}
          appSnapshot={appSnapshot}
          bookmarkFile={bookmarkFile}
        />
      ))}
    </Grid>
  );
}
