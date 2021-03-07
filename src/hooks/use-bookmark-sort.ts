import {useMemo, useState} from 'preact/hooks';
import {compareClickCount} from '../models/compare-click-count';
import {compareTime} from '../models/compare-time';
import {Bookmark} from '../models/parse-bookmark';

export interface BookmarkSort {
  readonly sortOrder: BookmarkSortOrder;

  changeSortOrder(): void;
  compare(a: Bookmark, b: Bookmark): number;
}

export type BookmarkSortOrder = 'timeAsc' | 'timeDesc' | 'clickCount';

export function useBookmarkSort(): BookmarkSort {
  const [sortOrder, setSortOrder] = useState<BookmarkSortOrder>(() => {
    const item = localStorage.getItem('sortOrder');

    return item === 'timeAsc' || item === 'timeDesc' ? item : 'clickCount';
  });

  const changeSortOrder = () => {
    if (sortOrder === 'clickCount') {
      localStorage.setItem('sortOrder', 'timeAsc');
      setSortOrder('timeAsc');
    } else if (sortOrder === 'timeAsc') {
      localStorage.setItem('sortOrder', 'timeDesc');
      setSortOrder('timeDesc');
    } else {
      localStorage.setItem('sortOrder', 'clickCount');
      setSortOrder('clickCount');
    }
  };

  const compare = (a: Bookmark, b: Bookmark) => {
    return sortOrder === 'timeAsc'
      ? compareTime(a, b)
      : sortOrder === 'timeDesc'
      ? compareTime(b, a)
      : compareClickCount(b, a) || compareTime(b, a);
  };

  return useMemo(() => ({sortOrder, changeSortOrder, compare}), [sortOrder]);
}
