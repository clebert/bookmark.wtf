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
        'px-2',
        'space-y-4',
        'md:space-y-0',
        'md:space-x-4',
      ])}
    >
      <h1 class="text-3xl font-bold whitespace-nowrap cursor-default select-none">
        <span class="text-black">bookmark.</span>
        <span class="text-red-600">w</span>
        <span class="text-green-600">t</span>
        <span class="text-blue-600">f</span>
      </h1>

      {children}
    </div>
  );
}
