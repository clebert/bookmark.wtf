import {Colors} from '../utils/colors.js';
import {join} from '../utils/join.js';
import * as React from 'react';

export interface TextFieldProps {
  readonly class?: string;
  readonly type?: 'url';
  readonly value: string;
  readonly placeholder?: string;
  readonly autoFocus?: boolean;
  readonly disabled?: boolean;
  readonly required?: boolean;

  onInput(value: string): void;
}

export function TextField({
  class: className,
  type,
  value,
  placeholder,
  autoFocus,
  disabled,
  required,
  onInput,
}: TextFieldProps): JSX.Element {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <input
      ref={inputRef}
      className={join([
        className,
        `w-full appearance-none rounded-none px-2`,
        Colors.text(),
        Colors.placeholderText(),
        Colors.border(),
        Colors.background(),
        Colors.focusOutline(),
        disabled && `opacity-25`,
      ])}
      type={type ?? `text`}
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      autoCorrect="off"
      disabled={disabled}
      required={required}
      spellCheck={false}
      onInput={React.useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
          event.preventDefault();
          onInput((event.target as HTMLInputElement).value ?? ``);
        },
        [onInput],
      )}
    />
  );
}
