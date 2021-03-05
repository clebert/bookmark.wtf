import {JSX, h} from 'preact';
import {useCallback, useContext} from 'preact/hooks';
import {HistoryContext} from '../hooks/use-history';
import {useSearchTerm} from '../hooks/use-search-term';
import {changeSearchTerm} from '../utils/change-search-term';
import {Button} from './button';
import {Icon} from './icon';
import {Input} from './input';

export function SearchForm(): JSX.Element {
  const searchTerm = useSearchTerm();
  const history = useContext(HistoryContext);

  const search = useCallback((value: string) => {
    history.replace(changeSearchTerm(value || undefined));
  }, []);

  const clearSearch = useCallback(() => {
    history.replace(changeSearchTerm(undefined));
  }, []);

  return (
    <div class="flex space-x-4">
      <Button disabled={!searchTerm.value} onClick={clearSearch}>
        <Icon type="search" />
        Clear
      </Button>

      <Input
        value={searchTerm.value}
        placeholder="Enter search term"
        autoFocus
        onInput={search}
      />
    </div>
  );
}
