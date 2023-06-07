import {Colors} from '../utils/colors.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface TextProps extends React.PropsWithChildren {
  readonly static?: boolean;
}

export function Label({children, static: isStatic}: TextProps): JSX.Element {
  return (
    <label
      className={joinClassNames(
        `overflow-hidden text-ellipsis whitespace-nowrap`,
        isStatic && `cursor-default select-none`,
        Colors.text(),
        Colors.border(`hidden`),
      )}
    >
      {children}
    </label>
  );
}
