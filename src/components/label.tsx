import * as React from 'react';
import {Styles, joinClassNames} from 'wtfkit';

export interface TextProps extends React.PropsWithChildren {
  readonly static?: boolean;
}

export function Label({children, static: isStatic}: TextProps): JSX.Element {
  const styles = React.useContext(Styles.Context);

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
