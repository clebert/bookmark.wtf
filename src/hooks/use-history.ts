import {createContext} from 'preact';
import {useCallback, useEffect, useMemo, useRef, useState} from 'preact/hooks';

export interface History {
  readonly url: string;

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

export function useHistory(): History {
  const [url, setUrl] = useState(() => window.location.href);
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
            const urlObject = new URL(window.location.href);

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

            if (urlObject.href === window.location.href) {
              return;
            }

            if (update.action === 'push') {
              window.history.pushState(undefined, '', urlObject.href);
            } else {
              window.history.replaceState(undefined, '', urlObject.href);
            }

            setUrl(window.location.href);
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
    const synchronize = () => setUrl(window.location.href);

    window.addEventListener('pageshow', synchronize);
    window.addEventListener('popstate', synchronize);

    return () => {
      cancelUpdate();
      window.removeEventListener('pageshow', synchronize);
      window.removeEventListener('popstate', synchronize);
    };
  }, []);

  return useMemo(() => ({url, scheduleUpdate, cancelUpdate}), [url]);
}
