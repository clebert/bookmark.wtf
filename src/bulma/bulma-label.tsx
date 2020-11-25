import classnames from 'classnames';
import React from 'react';

export interface BulmaLabelProps {
  readonly children: React.ReactNode;
  readonly size?: BulmaLabelSize;
}

export type BulmaLabelSize = 'small' | 'medium' | 'large';

/**
 * https://bulma.io/documentation/form/general/
 */
export function BulmaLabel(props: BulmaLabelProps): JSX.Element {
  return (
    <label
      className={classnames({
        label: true,
        [`is-${props.size ?? 'size'}`]: props.size,
      })}
    >
      {props.children}
    </label>
  );
}
