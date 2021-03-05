import {ComponentChildren, JSX, h} from 'preact';
import {join} from '../utils/join';

export interface TopbarProps {
  readonly children?: ComponentChildren;
}

export function Topbar({children}: TopbarProps): JSX.Element {
  return (
    <div
      class={join([
        'flex',
        'flex-col',
        'md:flex-row',
        'md:items-center',
        'space-y-4',
        'md:space-y-0',
        'md:space-x-4',
      ])}
    >
      {children}
    </div>
  );
}
