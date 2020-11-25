import React from 'react';

export interface BulmaBoxProps {
  readonly children: React.ReactNode;
}

/**
 * https://bulma.io/documentation/elements/box/
 */
export function BulmaBox(props: BulmaBoxProps): JSX.Element {
  return <div className="box">{props.children}</div>;
}
