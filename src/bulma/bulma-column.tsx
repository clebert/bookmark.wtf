import classnames from 'classnames';
import React from 'react';

export interface BulmaColumnProps {
  readonly children: React.ReactNode;
  readonly size?: BulmaColumnSize;
  readonly breakpointSizes?: BulmaColumnBreakpointSizes;
  readonly isNarrow?: boolean;
}

export type BulmaColumnSize =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12';

export interface BulmaColumnBreakpointSizes {
  readonly mobile?: BulmaColumnSize;
  readonly tablet?: BulmaColumnSize;
  readonly desktop?: BulmaColumnSize;
  readonly widescreen?: BulmaColumnSize;
  readonly fullHd?: BulmaColumnSize;
}

/**
 * https://bulma.io/documentation/columns/
 */
export function BulmaColumn(props: BulmaColumnProps): JSX.Element {
  const {mobile, tablet, desktop, widescreen, fullHd} =
    props.breakpointSizes ?? {};

  return (
    <div
      className={classnames({
        'column': true,
        [`is-${props.size ?? 'size'}`]: props.size,
        [`is-${mobile ?? 'mobile'}-mobile`]: mobile,
        [`is-${tablet ?? 'tablet'}-tablet`]: tablet,
        [`is-${desktop ?? 'desktop'}-desktop`]: desktop,
        [`is-${widescreen ?? 'widescreen'}-widescreen`]: widescreen,
        [`is-${fullHd ?? 'fullHd'}-fullhd`]: fullHd,
        'is-narrow': props.isNarrow,
      })}
    >
      {props.children}
    </div>
  );
}
