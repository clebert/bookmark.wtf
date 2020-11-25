import classnames from 'classnames';
import React from 'react';

export interface BulmaTagProps {
  readonly children: React.ReactNode;
  readonly color?: BulmaTagColor;
  readonly size?: BulmaTagSize;
  readonly href?: string;
  readonly isDelete?: boolean;
  readonly isLight?: boolean;
  readonly isRounded?: boolean;
  readonly onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export type BulmaTagColor =
  | 'black'
  | 'dark'
  | 'white'
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export type BulmaTagSize = 'medium' | 'large';

/**
 * https://bulma.io/documentation/elements/tag/
 */
export const BulmaTag = React.forwardRef<HTMLAnchorElement, BulmaTagProps>(
  (props, ref) => {
    const className = classnames({
      'tag': true,
      [`is-${props.color ?? 'color'}`]: props.color,
      [`is-${props.size ?? 'size'}`]: props.size,
      'is-delete': props.isDelete,
      'is-light': props.isLight,
      'is-rounded': props.isRounded,
    });

    return (
      <a
        ref={ref}
        className={className}
        href={props.href}
        onClick={props.onClick}
      >
        {props.children}
      </a>
    );
  }
);
