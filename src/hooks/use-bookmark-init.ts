import {useContext, useEffect, useMemo} from 'preact/hooks';
import {HistoryContext} from './use-history';

export interface BookmarkInit {
  readonly url: string;
  readonly title: string | undefined;
  readonly version: string | undefined;
}

export function useBookmarkInit(): BookmarkInit | undefined {
  const history = useContext(HistoryContext);

  useEffect(
    () =>
      history.scheduleUpdate(
        'replace',
        {type: 'param', key: 'title'},
        {type: 'param', key: 'url'},
        {type: 'param', key: 'version'}
      ),
    []
  );

  return useMemo(() => {
    const {searchParams} = new URL(history.initialUrl);
    const url = searchParams.get('url');
    const title = searchParams.get('title') ?? undefined;
    const version = searchParams.get('version') ?? undefined;

    return url ? {title, url, version} : undefined;
  }, []);
}
