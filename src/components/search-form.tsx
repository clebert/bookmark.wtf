import {TextField} from './text-field.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import * as React from 'react';

export function SearchForm(): JSX.Element {
  const searchTerm = AppTopics.searchTerm.use();
  const replaceSearch = React.useCallback(AppTopics.searchTerm.publish, []);

  return (
    <div className="w-full md:w-64">
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
