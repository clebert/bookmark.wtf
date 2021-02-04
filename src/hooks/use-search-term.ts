import {useCallback, useContext, useMemo} from 'preact/hooks';
import {HistoryContext} from './use-history';

export interface SearchTerm {
  readonly value: string;
  readonly regex: RegExp | undefined;

  setValue(value: string): void;
}

export function useSearchTerm(): SearchTerm {
  const history = useContext(HistoryContext);

  const setValue = useCallback(
    (value: string) => history.replace({type: 'param', key: 'search', value}),
    []
  );

  return useMemo(() => {
    const value = new URL(history.url).searchParams.get('search') ?? '';

    const regex = value
      ? new RegExp(value.split('').join('.?'), 'i')
      : undefined;

    return {value, regex, setValue};
  }, [history]);
}
