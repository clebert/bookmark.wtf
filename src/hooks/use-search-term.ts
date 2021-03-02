import {useContext, useMemo} from 'preact/hooks';
import {HistoryContext} from './use-history';

export interface SearchTerm {
  readonly value: string;
  readonly regex: RegExp | undefined;
}

export function useSearchTerm(): SearchTerm {
  const history = useContext(HistoryContext);

  return useMemo(() => {
    const value = new URL(history.url).searchParams.get('search') ?? '';

    const regex = value
      ? new RegExp(value.split('').join('.?'), 'i')
      : undefined;

    return {value, regex};
  }, [history]);
}
