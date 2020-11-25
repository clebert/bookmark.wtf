import classnames from 'classnames';
import React from 'react';

export interface BulmaTextProps {
  readonly children: React.ReactNode;
  readonly color?: BulmaTextColor;
  readonly backgroundColor?: BulmaTextColor;
  readonly href?: string;
  readonly tabIndex?: number;

  readonly onClick?: React.MouseEventHandler<
    HTMLAnchorElement | HTMLSpanElement
  >;
}

export type BulmaTextColor =
  | 'white'
  | 'black'
  | 'light'
  | 'dark'
  | 'primary'
  | 'primary-light'
  | 'primary-dark'
  | 'info'
  | 'info-light'
  | 'info-dark'
  | 'link'
  | 'link-light'
  | 'link-dark'
  | 'success'
  | 'success-light'
  | 'success-dark'
  | 'warning'
  | 'warning-light'
  | 'warning-dark'
  | 'danger'
  | 'danger-light'
  | 'danger-dark'
  | 'black-bis'
  | 'black-ter'
  | 'grey-darker'
  | 'grey-dark'
  | 'grey'
  | 'grey-light'
  | 'grey-lighter'
  | 'white-ter'
  | 'white-bis';

/**
 * https://bulma.io/documentation/modifiers/color-helpers/
 */
export function BulmaText(props: BulmaTextProps): JSX.Element {
  const className = classnames({
    [`has-text-${props.color ?? 'color'}`]: props.color,
    [`has-background-${
      props.backgroundColor ?? 'backgroundColor'
    }`]: props.backgroundColor,
  });

  return props.href ? (
    <a
      className={className}
      href={props.href}
      tabIndex={props.tabIndex}
      onClick={props.onClick}
    >
      {props.children}
    </a>
  ) : (
    <span
      className={className}
      tabIndex={props.tabIndex}
      onClick={props.onClick}
    >
      {props.children}
    </span>
  );
}
