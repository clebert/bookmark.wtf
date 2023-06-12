import type {Bookmark} from '../utils/parse-bookmark.js';

import {Button} from './button.js';
import {Form} from './form.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {TextField} from './text-field.js';
import * as React from 'react';

export interface NewBookmarkFormProps {
  onCancel(): void;
  onCreate?(bookmark: Bookmark): void;
}

export function NewBookmarkForm({onCancel, onCreate}: NewBookmarkFormProps): JSX.Element {
  const [currentTitle, setCurrentTitle] = React.useState(``);
  const [currentUrl, setCurrentUrl] = React.useState(``);

  const create = React.useMemo(() => {
    const title = currentTitle.trim();
    const url = currentUrl.trim();

    return onCreate && title && url ? () => onCreate({title, url, ctime: Date.now()}) : undefined;
  }, [onCreate, currentTitle, currentUrl]);

  return (
    <Form onSubmit={create}>
      <GridItem
        row1={
          <TextField
            type="url"
            value={currentUrl}
            placeholder="Enter URL"
            autoFocus
            required
            onInput={setCurrentUrl}
          />
        }
        row2={
          <TextField
            value={currentTitle}
            placeholder="Enter title"
            required
            onInput={setCurrentTitle}
          />
        }
        rightCol={
          <>
            <Button type="submit" title="Create bookmark" disabled={!create} inverted>
              <Icon type="check" />
              Create
            </Button>

            <Button title="Cancel creating bookmark" onClick={onCancel}>
              <Icon type="x" />
              Cancel
            </Button>
          </>
        }
      />
    </Form>
  );
}
