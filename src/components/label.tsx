import {Colors} from '../utils/colors.js';
import {join} from '../utils/join.js';
import * as React from 'react';

export interface TextProps extends React.PropsWithChildren {
  readonly bold?: boolean;
  readonly static?: boolean;
}

export function Label({
  children,
  bold,
  static: isStatic,
}: TextProps): JSX.Element {
  return (
    <label
      className={join([
        `overflow-hidden text-ellipsis whitespace-nowrap`,
        Colors.text(),
        Colors.border(`hidden`),
        bold && `font-bold`,
        isStatic && `cursor-default`,
        isStatic && `select-none`,
      ])}
    >
      {children}
    </label>
  );
}
