import {JSX} from 'preact';
import {Button} from './button';
import {Icon} from './icon';

export interface DeleteButtonProps {
  readonly targetName: 'bookmark' | 'collection';
  readonly verbose?: boolean;

  action?(): void;
}

export function DeleteButton({
  targetName,
  verbose,
  action,
}: DeleteButtonProps): JSX.Element {
  return (
    <Button
      class="DeleteButton"
      theme={verbose ? 'danger' : undefined}
      title={`Delete ${targetName}`}
      onClick={action}
    >
      <Icon type="trash" standalone={!verbose} />
      {verbose && 'Delete'}
    </Button>
  );
}
