import {useCallback, useContext, useMemo} from 'preact/hooks';
import {HistoryContext} from './use-history';
import {useSearchTerm} from './use-search-term';

export type GistSelection = SetGistSelection | UnsetGistSelection;

export interface SetGistSelection {
  readonly state: 'set';
  readonly gistName: string;

  setGistName(gistName: string | undefined): void;
}

export interface UnsetGistSelection {
  readonly state: 'unset';
  readonly gistName?: undefined;

  setGistName(gistName: string): void;
}

export function useGistSelection(): GistSelection {
  const history = useContext(HistoryContext);
  const searchTerm = useSearchTerm();

  const setGistName = useCallback((gistName: string | undefined) => {
    searchTerm.setValue('');
    history.push({type: 'pathname', pathname: '/' + (gistName ?? '')});
  }, []);

  return useMemo(() => {
    const gistName = new URL(history.url).pathname.split('/')[1];

    return gistName
      ? {state: 'set', gistName, setGistName}
      : {state: 'unset', setGistName};
  }, [history]);
}
