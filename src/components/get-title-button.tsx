import type {Sender} from 'loxia';

import {Button} from './button.js';
import {Icon} from './icon.js';
import {useBinder} from '../hooks/use-binder.js';
import * as React from 'react';

export interface GetTitleButtonProps {
  readonly sender: Sender;
  readonly url: string;

  setTitle(title: string): void;
}

export function GetTitleButton({
  sender,
  url,
  setTitle,
}: GetTitleButtonProps): JSX.Element {
  const bind = useBinder();

  const getTitle = React.useMemo(
    () =>
      url && sender.state === `idle`
        ? () =>
            sender.send(
              fetch(`/api/get-title?url=${encodeURIComponent(url)}`)
                .then(
                  bind(async (response: Response) =>
                    response
                      .json()
                      .then(
                        bind((title) =>
                          setTitle(
                            typeof title === `string` ? title : `No title`,
                          ),
                        ),
                      ),
                  ),
                )
                .catch(bind(() => setTitle(`No title`))),
            )
        : undefined,
    [sender, url],
  );

  return (
    <Button title="Get title" onClick={getTitle}>
      <Icon type="download" standalone />
    </Button>
  );
}
