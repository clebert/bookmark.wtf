import {Bookmark} from './parse-bookmark';

export function compareBookmarks(
  a: Pick<Bookmark, 'ctime' | 'mtime' | 'clickCount'>,
  b: Pick<Bookmark, 'ctime' | 'mtime' | 'clickCount'>
): -1 | 0 | 1 {
  const {ctime: ctimeA, mtime: timeA = ctimeA, clickCount: clickCountA = 0} = a;
  const {ctime: ctimeB, mtime: timeB = ctimeB, clickCount: clickCountB = 0} = b;

  if (clickCountA !== clickCountB) {
    return clickCountA < clickCountB ? 1 : -1;
  }

  return timeA < timeB ? 1 : timeA > timeB ? -1 : 0;
}
