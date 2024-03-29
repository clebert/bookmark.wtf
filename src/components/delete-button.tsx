import * as React from 'react';
import {Button, Icon} from 'wtfkit';

export interface DeleteButtonProps {
  targetName: 'bookmark' | 'collection';
  verbose?: boolean;

  action?(): void;
}

export function DeleteButton({targetName, verbose, action}: DeleteButtonProps): JSX.Element {
  return (
    <Button
      className="DeleteButton"
      title={`Delete ${targetName}`}
      inverted={verbose}
      onClick={action}
    >
      <Icon type="trash" standalone={!verbose} />
      {verbose && `Delete`}
    </Button>
  );
}
