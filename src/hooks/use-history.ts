import {createContext} from 'preact';
import {useCallback, useEffect, useMemo, useRef, useState} from 'preact/hooks';

export interface HistoryBackend {
  readonly url: string;

  push(url: string): void;
  replace(url: string): void;
}

export interface History {
  readonly url: string;
  readonly initialUrl: string;

  scheduleUpdate(
    action: 'push' | 'replace',
    ...changes: readonly [HistoryChange, ...HistoryChange[]]
  ): void;

  cancelUpdate(): void;
}

export type HistoryChange = PathnameChange | ParamChange;

export interface PathnameChange {
  readonly type: 'pathname';
  readonly pathname: string;
}

export interface ParamChange {
  readonly type: 'param';
  readonly key: string;
  readonly value?: string;
}

interface Update {
  action: 'push' | 'replace';
  changes: readonly HistoryChange[];
}

export const HistoryContext = createContext<History>(undefined as any);

export function useHistory(backend: HistoryBackend): History {
  const initialUrl = useMemo(() => backend.url, []);
  const [url, setUrl] = useState(initialUrl);
  const updateRef = useRef<Update | undefined>(undefined);

  const scheduleUpdate = useCallback<History['scheduleUpdate']>(
    (action, ...changes) => {
      if (!updateRef.current) {
        updateRef.current = {action, changes};

        Promise.resolve()
          .then(() => {
            if (!updateRef.current) {
              return;
            }

            const update = updateRef.current;
            const urlObject = new URL(backend.url);

            for (const change of update.changes) {
              if (change.type === 'pathname') {
                urlObject.pathname = change.pathname;
              } else if (change.value) {
                urlObject.searchParams.set(change.key, change.value);
              } else {
                urlObject.searchParams.delete(change.key);
              }
            }

            updateRef.current = undefined;

            if (urlObject.href === backend.url) {
              return;
            }

            if (update.action === 'push') {
              backend.push(urlObject.href);
            } else {
              backend.replace(urlObject.href);
            }

            setUrl(backend.url);
          })
          .catch((error) => console.error('Failed to update history.', error));
      } else {
        if (action === 'push') {
          updateRef.current.action = action;
        }

        updateRef.current.changes = [...updateRef.current.changes, ...changes];
      }
    },
    []
  );

  const cancelUpdate = useCallback(
    () => void (updateRef.current = undefined),
    []
  );

  useEffect(() => {
    const synchronize = () => setUrl(backend.url);

    if (isBrowser()) {
      window.addEventListener('pageshow', synchronize);
      window.addEventListener('popstate', synchronize);
    }

    return () => {
      cancelUpdate();

      if (isBrowser()) {
        window.removeEventListener('pageshow', synchronize);
        window.removeEventListener('popstate', synchronize);
      }
    };
  }, []);

  return useMemo(() => ({url, initialUrl, scheduleUpdate, cancelUpdate}), [
    url,
  ]);
}

function isBrowser(): boolean {
  return Boolean(
    typeof window !== 'undefined' &&
      window.addEventListener &&
      window.removeEventListener
  );
}
