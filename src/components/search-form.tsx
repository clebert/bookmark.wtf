import type {JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {AppTopics} from '../pub-sub/app-topics.js';
import {TextField} from './text-field.js';

export function SearchForm(): JSX.Element {
  const searchTerm = AppTopics.searchTerm.use();
  const replaceSearch = useCallback(AppTopics.searchTerm.publish, []);

  return (
    <div class="w-full md:w-64">
      <TextField
        value={searchTerm}
        placeholder="Enter search term"
        autoFocus
        highlight={searchTerm.length > 0}
        onInput={replaceSearch}
      />
    </div>
  );
}
