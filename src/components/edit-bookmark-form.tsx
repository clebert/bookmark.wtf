import {Button} from './button.js';
import {Form} from './form.js';
import {GridItem} from './grid-item.js';
import {Icon} from './icon.js';
import {TextField} from './text-field.js';
import * as React from 'react';

export interface EditBookmarkFormProps {
  readonly initialTitle: string;
  readonly initialUrl: string;

  onCancel(): void;
  onUpdate?(title: string, url: string): void;
}

export function EditBookmarkForm({
  initialTitle,
  initialUrl,
  onCancel,
  onUpdate,
}: EditBookmarkFormProps): JSX.Element {
  const [currentTitle, setCurrentTitle] = React.useState(initialTitle);
  const [currentUrl, setCurrentUrl] = React.useState(initialUrl);

  const update = React.useMemo(() => {
    const title = currentTitle.trim();
    const url = currentUrl.trim();

    return onUpdate &&
      title &&
      url &&
      (title !== initialTitle || url !== initialUrl)
      ? () => onUpdate(title, url)
      : undefined;
  }, [onUpdate, currentTitle, currentUrl]);

  return (
    <Form onSubmit={update}>
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
            <Button
              type="submit"
              theme="success"
              title="Update bookmark"
              disabled={!update}
            >
              <Icon type="check" />
              Update
            </Button>

            <Button title="Cancel updating bookmark" onClick={onCancel}>
              <Icon type="x" />
              Cancel
            </Button>
          </>
        }
      />
    </Form>
  );
}
