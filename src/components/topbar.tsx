import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface TopbarProps extends React.PropsWithChildren {
  readonly className?: string;
}

export function Topbar({children, className}: TopbarProps): JSX.Element {
  return (
    <div
      className={joinClassNames(
        className,
        `flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0`,
      )}
    >
      {children}
    </div>
  );
}
