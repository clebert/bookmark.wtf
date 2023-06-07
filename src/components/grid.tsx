import {join} from '../utils/join.js';
import * as React from 'react';

export function Grid({children}: React.PropsWithChildren): JSX.Element {
  return (
    <div
      className={join([
        `grid`,
        `grid-cols-1`,
        `md:grid-cols-2`,
        `xl:grid-cols-3`,
        `2xl:grid-cols-4`,
        `gap-4`,
      ])}
    >
      {children}
    </div>
  );
}
