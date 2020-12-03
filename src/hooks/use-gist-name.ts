import * as React from 'react';
import {HistoryContext} from './use-history';

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
  const history = React.useContext(HistoryContext);

  const setGistName = React.useCallback(
    (gistName: string | undefined) =>
      history.push({pathname: '/' + (gistName ?? '')}),
    [history]
  );

  return React.useMemo(() => {
    const gistName = history.pathname.split('/')[1];

    return gistName
      ? {status: 'set', gistName, setGistName}
      : {status: 'unset', setGistName};
  }, [history]);
}
