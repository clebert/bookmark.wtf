import {StylesContext} from '../contexts/styles-context.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface TextProps extends React.PropsWithChildren {
  readonly static?: boolean;
}

export function Label({children, static: isStatic}: TextProps): JSX.Element {
  const styles = React.useContext(StylesContext);

  return (
    <label
      className={joinClassNames(
        `overflow-hidden text-ellipsis whitespace-nowrap`,
        isStatic && `cursor-default select-none`,
        styles.border({transparent: true}),
        styles.text(),
      )}
    >
      {children}
    </label>
  );
}
