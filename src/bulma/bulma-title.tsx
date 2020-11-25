import classnames from 'classnames';
import React from 'react';
import {BulmaTextColor} from './bulma-text';

export interface BulmaTitleProps {
  readonly children: React.ReactNode;
  readonly color?: BulmaTextColor;
  readonly backgroundColor?: BulmaTextColor;
  readonly size?: BulmaTitleSize;
  readonly isSpaced?: boolean;
  readonly isSubtitle?: boolean;
}

export type BulmaTitleSize = '1' | '2' | '3' | '4' | '5' | '6';

/**
 * https://bulma.io/documentation/elements/title/
 */
export function BulmaTitle(props: BulmaTitleProps): JSX.Element {
  const Heading = `h${props.size ?? 3}` as
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6';

  return (
    <Heading
      className={classnames({
        'title': !props.isSubtitle,
        'subtitle': props.isSubtitle,
        [`has-text-${props.color ?? 'color'}`]: props.color,
        [`has-background-${
          props.backgroundColor ?? 'backgroundColor'
        }`]: props.backgroundColor,
        [`is-${props.size ?? 'size'}`]: props.size,
        'is-spaced': props.isSpaced,
      })}
    >
      {props.children}
    </Heading>
  );
}
