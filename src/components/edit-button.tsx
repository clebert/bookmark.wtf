import {Button} from './button.js';
import {Icon} from './icon.js';
import * as React from 'react';

export interface EditButtonProps {
  readonly targetName: 'bookmark' | 'collection';

  action?(): void;
}

export function EditButton({targetName, action}: EditButtonProps): JSX.Element {
  return (
    <Button class="EditButton" title={`Edit ${targetName}`} onClick={action}>
      <Icon type="pencil" standalone />
    </Button>
  );
}
