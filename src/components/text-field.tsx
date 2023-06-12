import {StylesContext} from '../contexts/styles-context.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface TextFieldProps {
  className?: string;
  type?: 'url';
  value: string;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  required?: boolean;

  onInput(value: string): void;
}

export function TextField({
  className,
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

  const handleInput = React.useCallback<React.FormEventHandler<HTMLInputElement>>(
    (event) => {
      event.preventDefault();
      onInput(event.currentTarget.value);
    },
    [onInput],
  );

  const styles = React.useContext(StylesContext);

  return (
    <input
      ref={inputRef}
      className={joinClassNames(
        className,
        `w-full appearance-none rounded-none px-2`,
        disabled && `opacity-25`,
        styles.background(),
        styles.border(),
        styles.focus(),
        styles.text({placeholder: true}),
      )}
      type={type ?? `text`}
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      autoCorrect="off"
      disabled={disabled}
      required={required}
      spellCheck={false}
      onInput={handleInput}
    />
  );
}
