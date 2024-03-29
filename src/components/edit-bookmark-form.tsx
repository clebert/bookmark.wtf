import {Form} from './form.js';
import {GridItem} from './grid-item.js';
import * as React from 'react';
import {Button, Icon, TextField} from 'wtfkit';

export interface EditBookmarkFormProps {
  initialTitle: string;
  initialUrl: string;

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

    return onUpdate && title && url && (title !== initialTitle || url !== initialUrl)
      ? () => onUpdate(title, url)
      : undefined;
  }, [onUpdate, currentTitle, currentUrl]);

  const textFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    textFieldRef.current?.focus();
  }, []);

  return (
    <Form onSubmit={update}>
      <GridItem
        row1={
          <TextField
            ref={textFieldRef}
            type="url"
            value={currentUrl}
            placeholder="Enter URL"
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
            <Button type="submit" title="Update bookmark" disabled={!update} inverted>
              <Icon type="check" />
              Update
            </Button>

            <Button title="Cancel updating bookmark" onClick={onCancel}>
              <Icon type="xMark" />
              Cancel
            </Button>
          </>
        }
      />
    </Form>
  );
}
