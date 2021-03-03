import {ComponentChildren, JSX, h} from 'preact';
import {Colors} from '../utils/colors';
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
      <h1
        class={join([
          'text-3xl',
          'font-bold',
          'whitespace-nowrap',
          'cursor-default',
          'select-none',
        ])}
      >
        <span class={Colors.text()}>bookmark.</span>
        <span class={Colors.text('danger')}>w</span>
        <span class={Colors.text('success')}>t</span>
        <span class={Colors.text('link')}>f</span>
      </h1>

      {children}
    </div>
  );
}
