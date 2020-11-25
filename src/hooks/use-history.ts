import React from 'react';

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

export const HistoryContext = React.createContext<History>(undefined as any);

export function useHistory(): History {
  const [pathname, setPathname] = React.useState(window.location.pathname);
  const [search, setSearch] = React.useState(window.location.search);

  const synchronize = React.useCallback(() => {
    setPathname(window.location.pathname);
    setSearch(window.location.search);
  }, []);

  const push = React.useCallback((url: PartialUrl) => {
    const newPathname = url.pathname ?? window.location.pathname;
    const newSearch = url.search ?? window.location.search;

    window.history.pushState(undefined, '', newPathname + newSearch);
    synchronize();
  }, []);

  const replace = React.useCallback((url: PartialUrl) => {
    const newPathname = url.pathname ?? window.location.pathname;
    const newSearch = url.search ?? window.location.search;

    window.history.replaceState(undefined, '', newPathname + newSearch);
    synchronize();
  }, []);

  React.useEffect(() => {
    window.addEventListener('pageshow', synchronize);
    window.addEventListener('popstate', synchronize);

    return () => {
      window.removeEventListener('pageshow', synchronize);
      window.removeEventListener('popstate', synchronize);
    };
  }, []);

  return React.useMemo(() => ({pathname, search, push, replace}), [
    pathname,
    search,
  ]);
}
