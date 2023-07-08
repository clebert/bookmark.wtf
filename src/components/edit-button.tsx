import * as React from 'react';
import {Button, Icon} from 'wtfkit';

export interface EditButtonProps {
  targetName: 'bookmark' | 'collection';

  action?(): void;
}

export function EditButton({targetName, action}: EditButtonProps): JSX.Element {
  return (
    <Button className="EditButton" title={`Edit ${targetName}`} onClick={action}>
      <Icon type="pencilSquare" standalone />
    </Button>
  );
}
