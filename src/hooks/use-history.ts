import {createContext} from 'preact';
import {useCallback, useEffect, useMemo, useState} from 'preact/hooks';

export interface History {
  readonly url: string;

  push(...changes: readonly [HistoryChange, ...HistoryChange[]]): void;
  replace(...changes: readonly [HistoryChange, ...HistoryChange[]]): void;
}

export type HistoryChange = PathnameHistoryChange | ParamHistoryChange;

export interface PathnameHistoryChange {
  readonly type: 'pathname';
  readonly pathname: string;
}

export interface ParamHistoryChange {
  readonly type: 'param';
  readonly key: string;
  readonly value?: string;
}

export const HistoryContext = createContext<History>(undefined as any);

export function useHistory(): History {
  const [url, setUrl] = useState(window.location.href);

  const push = useCallback<History['push']>((...changes) => {
    window.history.pushState(undefined, '', applyChanges(changes));
    setUrl(window.location.href);
  }, []);

  const replace = useCallback<History['replace']>((...changes) => {
    window.history.replaceState(undefined, '', applyChanges(changes));
    setUrl(window.location.href);
  }, []);

  useEffect(() => {
    const synchronize = () => setUrl(window.location.href);

    window.addEventListener('popstate', synchronize);

    return () => window.removeEventListener('popstate', synchronize);
  }, []);

  return useMemo(() => ({url, push, replace}), [url]);
}

function applyChanges(changes: readonly HistoryChange[]): string {
  const urlObject = new URL(window.location.href);

  for (const change of changes) {
    if (change.type === 'pathname') {
      urlObject.pathname = change.pathname;
    } else if (change.value) {
      urlObject.searchParams.set(change.key, change.value);
    } else {
      urlObject.searchParams.delete(change.key);
    }
  }

  return urlObject.href;
}
