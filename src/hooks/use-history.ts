import {createContext} from 'preact';
import {useCallback, useEffect, useMemo, useState} from 'preact/hooks';

export interface History {
  readonly pathname: string;
  readonly search: string;

  push(url: PartialUrl): void;
  replace(url: PartialUrl): void;
}

export interface PartialUrl {
  readonly pathname?: string;
  readonly search?: string;
}

export const HistoryContext = createContext<History>(undefined as any);

export function useHistory(): History {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [search, setSearch] = useState(window.location.search);

  const synchronize = useCallback(() => {
    setPathname(window.location.pathname);
    setSearch(window.location.search);
  }, []);

  const push = useCallback((url: PartialUrl) => {
    const newPathname = url.pathname ?? window.location.pathname;
    const newSearch = url.search ?? window.location.search;

    window.history.pushState(undefined, '', newPathname + newSearch);
    synchronize();
  }, []);

  const replace = useCallback((url: PartialUrl) => {
    const newPathname = url.pathname ?? window.location.pathname;
    const newSearch = url.search ?? window.location.search;

    window.history.replaceState(undefined, '', newPathname + newSearch);
    synchronize();
  }, []);

  useEffect(() => {
    window.addEventListener('pageshow', synchronize);
    window.addEventListener('popstate', synchronize);

    return () => {
      window.removeEventListener('pageshow', synchronize);
      window.removeEventListener('popstate', synchronize);
    };
  }, []);

  return useMemo(() => ({pathname, search, push, replace}), [pathname, search]);
}
