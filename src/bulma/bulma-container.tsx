import classnames from 'classnames';
import React from 'react';

export interface BulmaContainerProps {
  readonly children: React.ReactNode;
  readonly isFluid?: boolean;
  readonly isFullHd?: boolean;
  readonly isWidescreen?: boolean;
}

/**
 * https://bulma.io/documentation/layout/container/
 */
export function BulmaContainer(props: BulmaContainerProps): JSX.Element {
  return (
    <div
      className={classnames({
        'container': true,
        'is-fluid': props.isFluid,
        'is-fullhd': props.isFullHd,
        'is-widescreen': props.isWidescreen,
      })}
    >
      {props.children}
    </div>
  );
}
