import classnames from 'classnames';
import React from 'react';

export interface BulmaButtonProps {
  readonly children?: React.ReactNode;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly form?: string;
  readonly color?: BulmaButtonColor;
  readonly size?: BulmaButtonSize;
  readonly isDisabled?: boolean;
  readonly isInverted?: boolean;
  readonly isLight?: boolean;
  readonly isLoading?: boolean;
  readonly isOutlined?: boolean;
  readonly isRounded?: boolean;
  readonly isStatic?: boolean;
  readonly onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export type BulmaButtonColor =
  | 'black'
  | 'dark'
  | 'white'
  | 'text'
  | 'ghost'
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export type BulmaButtonSize = 'small' | 'medium' | 'large';

/**
 * https://bulma.io/documentation/elements/button/
 */
export function BulmaButton(props: BulmaButtonProps): JSX.Element {
  return (
    <div className="control">
      <button
        type={props.type ?? 'button'}
        form={props.form}
        className={classnames({
          'button': true,
          [`is-${props.color ?? 'color'}`]: props.color,
          [`is-${props.size ?? 'size'}`]: props.size,
          'is-inverted': props.isInverted,
          'is-light': props.isLight,
          'is-loading': props.isLoading,
          'is-outlined': props.isOutlined,
          'is-rounded': props.isRounded,
          'is-static': props.isStatic,
        })}
        disabled={props.isDisabled}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </div>
  );
}
