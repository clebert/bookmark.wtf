import {JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {AppHistory} from '../pub-sub/app-history';
import {TextField} from './text-field';

export function SearchForm(): JSX.Element {
  const value = AppHistory.singleton.useSearch();

  const replaceSearch = useCallback(
    AppHistory.singleton.replaceSearch.bind(AppHistory.singleton),
    []
  );

  return (
    <div class="w-full md:w-64">
      <TextField
        value={value}
        placeholder="Enter search term"
        autoFocus
        highlight={value.length > 0}
        onInput={replaceSearch}
      />
    </div>
  );
}
