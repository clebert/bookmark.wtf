import {useContext, useMemo} from 'preact/hooks';
import {HistoryContext} from './use-history';

export function useGistName(): string | undefined {
  const history = useContext(HistoryContext);

  return useMemo(() => new URL(history.url).pathname.split('/')[1], [history]);
}
