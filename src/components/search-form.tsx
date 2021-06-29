import {JSX, h} from 'preact';
import {useCallback, useContext} from 'preact/hooks';
import {HistoryContext} from '../hooks/use-history';
import {useSearchTerm} from '../hooks/use-search-term';
import {changeSearchTerm} from '../utils/change-search-term';
import {TextField} from './text-field';

export function SearchForm(): JSX.Element {
  const searchTerm = useSearchTerm();
  const history = useContext(HistoryContext);

  const search = useCallback((value: string) => {
    history.replace(changeSearchTerm(value || undefined));
  }, []);

  return (
    <div class="w-full md:w-64">
      <TextField
        value={searchTerm.value}
        placeholder="Enter search term"
        autoFocus
        onInput={search}
      />
    </div>
  );
}
