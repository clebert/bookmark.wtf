import {useCallback, useContext, useMemo} from 'preact/hooks';
import {HistoryContext} from './use-history';
import {useSearchTerm} from './use-search-term';

export type GistNameState = SetGistNameState | UnsetGistNameState;

export interface SetGistNameState {
  readonly status: 'set';
  readonly gistName: string;
  readonly setGistName: (gistName: string | undefined) => void;
}

export interface UnsetGistNameState {
  readonly status: 'unset';
  readonly gistName?: undefined;
  readonly setGistName: (gistName: string | undefined) => void;
}

export function useGistName(): GistNameState {
  const history = useContext(HistoryContext);
  const searchTerm = useSearchTerm();

  const setGistName = useCallback((gistName: string | undefined) => {
    searchTerm.setValue('');

    history.scheduleUpdate('push', {
      type: 'pathname',
      pathname: '/' + (gistName ?? ''),
    });
  }, []);

  return useMemo(() => {
    const gistName = new URL(history.url).pathname.split('/')[1];

    return gistName
      ? {status: 'set', gistName, setGistName}
      : {status: 'unset', setGistName};
  }, [history]);
}
