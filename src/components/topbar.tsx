import type {ComponentChildren, JSX} from 'preact';

import {join} from '../utils/join.js';

export interface TopbarProps {
  readonly children?: ComponentChildren;
  readonly class?: string;
}

export function Topbar({children, class: className}: TopbarProps): JSX.Element {
  return (
    <div
      class={join([
        className,
        `flex`,
        `flex-col`,
        `md:flex-row`,
        `md:items-center`,
        `space-y-4`,
        `md:space-y-0`,
        `md:space-x-4`,
      ])}
    >
      {children}
    </div>
  );
}
