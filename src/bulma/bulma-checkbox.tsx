import React from 'react';

export interface BulmaCheckboxProps {
  readonly children: React.ReactNode;
  readonly value?: string;
  readonly isChecked?: boolean;
  readonly isDisabled?: boolean;
  readonly onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * https://bulma.io/documentation/form/checkbox/
 */
export function BulmaCheckbox(props: BulmaCheckboxProps): JSX.Element {
  return (
    <label className="checkbox">
      <input
        type="checkbox"
        value={props.value}
        checked={props.isChecked}
        disabled={props.isDisabled}
        onChange={props.onChange}
      />

      {props.children}
    </label>
  );
}
