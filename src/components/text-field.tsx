import {StylesContext} from '../contexts/styles-context.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface TextFieldProps {
  readonly className?: string;
  readonly type?: 'url';
  readonly value: string;
  readonly placeholder?: string;
  readonly autoFocus?: boolean;
  readonly disabled?: boolean;
  readonly required?: boolean;

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
