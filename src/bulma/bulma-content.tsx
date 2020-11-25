import classnames from 'classnames';
import React from 'react';

export interface BulmaContentProps {
  readonly children: React.ReactNode;
  readonly size?: BulmaContentSize;
  readonly isHidden?: BulmaContentHiddenBreakpoint;
}

/**
 * https://bulma.io/documentation/modifiers/responsive-helpers/#hide
 */
export type BulmaContentHiddenBreakpoint =
  | 'mobile'
  | 'tablet-only'
  | 'desktop-only'
  | 'widescreen-only'
  | 'touch'
  | 'tablet'
  | 'desktop'
  | 'widescreen'
  | 'fullHd';

export type BulmaContentSize = 'small' | 'medium' | 'large';

/**
 * https://bulma.io/documentation/elements/content/
 */
export function BulmaContent(props: BulmaContentProps): JSX.Element {
  return (
    <div
      className={classnames({
        content: true,
        [`is-${props.size ?? 'size'}`]: props.size,
        [`is-hidden-${
          props.isHidden?.toLowerCase() ?? 'isHidden'
        }`]: props.isHidden,
      })}
    >
      {props.children}
    </div>
  );
}
