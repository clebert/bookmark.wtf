import {JSX, h} from 'preact';
import {Button} from './button';
import {Icon} from './icon';

export interface ZenButtonProps {
  readonly zenMode: boolean;

  onChangeZenMode(): void;
}

export function ZenButton({
  zenMode,
  onChangeZenMode,
}: ZenButtonProps): JSX.Element {
  return (
    <Button class="ZenButton" title="Change Zen mode" onClick={onChangeZenMode}>
      <Icon type={zenMode ? 'eye' : 'eyeOff'} standalone />
    </Button>
  );
}
