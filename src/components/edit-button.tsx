import {JSX, h} from 'preact';
import {Button} from './button';
import {Icon} from './icon';

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
