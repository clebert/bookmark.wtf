import classnames from 'classnames';
import React from 'react';

export interface BulmaTextAreaProps {
  readonly color?: BulmaTextAreaColor;
  readonly size?: BulmaTextAreaSize;
  readonly rows?: number;
  readonly placeholder?: string;
  readonly value?: string;
  readonly hasFixedSize?: boolean;
  readonly isAutoCompleted?: boolean;
  readonly isAutoCorrected?: boolean;
  readonly isDisabled?: boolean;
  readonly isLoading?: boolean;
  readonly isReadOnly?: boolean;
  readonly isRequired?: boolean;
  readonly isSpellChecked?: boolean;
}

export type BulmaTextAreaColor =
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export type BulmaTextAreaSize = 'small' | 'medium' | 'large';

/**
 * https://bulma.io/documentation/form/textarea/
 */
export const BulmaTextArea = React.forwardRef<
  HTMLTextAreaElement,
  BulmaTextAreaProps
>((props, ref) => {
  return (
    <div
      className={classnames({
        'control': true,
        'is-loading': props.isLoading,
        [`is-${props.size ?? 'size'}`]: props.isLoading && props.size,
      })}
    >
      <textarea
        ref={ref}
        className={classnames({
          'textarea': true,
          [`is-${props.color ?? 'color'}`]: props.color,
          [`is-${props.size ?? 'size'}`]: props.size,
          'has-fixed-size': props.hasFixedSize,
        })}
        rows={props.rows}
        placeholder={props.placeholder}
        value={props.value}
        autoComplete={props.isAutoCompleted ? 'on' : 'off'}
        autoCorrect={props.isAutoCorrected ? 'on' : 'off'}
        disabled={props.isDisabled}
        readOnly={props.isReadOnly}
        required={props.isRequired}
        spellCheck={props.isSpellChecked}
      />
    </div>
  );
});
