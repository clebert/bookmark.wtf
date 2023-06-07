import {join} from '../utils/join.js';
import * as React from 'react';

export interface TopbarProps extends React.PropsWithChildren {
  readonly class?: string;
}

export function Topbar({children, class: className}: TopbarProps): JSX.Element {
  return (
    <div
      className={join([
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
