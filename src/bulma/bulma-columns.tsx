import classnames from 'classnames';
import React from 'react';

export interface BulmaColumnsProps {
  readonly children: React.ReactNode;
  readonly gap?: BulmaColumnsGap;
  readonly breakpointGaps?: BulmaColumnsBreakpointGaps;
  readonly isCentered?: boolean;
  readonly isDesktop?: boolean;
  readonly isGapless?: boolean;
  readonly isMobile?: boolean;
  readonly isMultiline?: boolean;
  readonly isVCentered?: boolean;
  readonly isVariable?: boolean;
}

export type BulmaColumnsGap =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8';

export interface BulmaColumnsBreakpointGaps {
  readonly mobile?: BulmaColumnsGap;
  readonly tablet?: BulmaColumnsGap;
  readonly desktop?: BulmaColumnsGap;
  readonly widescreen?: BulmaColumnsGap;
  readonly fullHd?: BulmaColumnsGap;
}

/**
 * https://bulma.io/documentation/columns/
 */
export function BulmaColumns(props: BulmaColumnsProps): JSX.Element {
  const {mobile, tablet, desktop, widescreen, fullHd} =
    props.breakpointGaps ?? {};

  return (
    <div
      className={classnames({
        'columns': true,
        [`is-${props.gap ?? 'gap'}`]: props.gap,
        [`is-${mobile ?? 'mobile'}-mobile`]: mobile,
        [`is-${tablet ?? 'tablet'}-tablet`]: tablet,
        [`is-${desktop ?? 'desktop'}-desktop`]: desktop,
        [`is-${widescreen ?? 'widescreen'}-widescreen`]: widescreen,
        [`is-${fullHd ?? 'fullHd'}-fullhd`]: fullHd,
        'is-centered': props.isCentered,
        'is-desktop': props.isDesktop,
        'is-gapless': props.isGapless,
        'is-mobile': props.isMobile,
        'is-multiline': props.isMultiline,
        'is-vcentered': props.isVCentered,
        'is-variable': props.isVariable,
      })}
    >
      {props.children}
    </div>
  );
}
