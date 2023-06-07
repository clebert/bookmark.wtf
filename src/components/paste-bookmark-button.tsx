import type {GistStore} from '../hooks/use-gist-store.js';

import {Button} from './button.js';
import {Icon} from './icon.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import {createRandomValue} from '../utils/create-random-value.js';
import {serializeBookmark} from '../utils/serialize-bookmark.js';
import * as React from 'react';

export interface PasteBookmarkButtonProps {
  readonly gistStore: GistStore;
}

export function PasteBookmarkButton({
  gistStore,
}: PasteBookmarkButtonProps): JSX.Element {
  const bookmark = AppTopics.bookmark.use();

  const paste = React.useMemo(() => {
    return `createFile` in gistStore && bookmark
      ? () => {
          gistStore.createFile(
            createRandomValue() + `.md`,
            serializeBookmark({...bookmark, mtime: Date.now()}),
          );

          AppTopics.bookmark.publish(undefined);
        }
      : undefined;
  }, [gistStore, bookmark]);

  return (
    <Button
      class="PasteBookmarkButton"
      title="Paste bookmark"
      highlight={Boolean(bookmark)}
      onClick={paste}
    >
      <Icon type="clipboard" standalone />
    </Button>
  );
}
