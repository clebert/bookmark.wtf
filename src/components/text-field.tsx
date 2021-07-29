import {JSX} from 'preact';
import {useCallback, useEffect, useRef} from 'preact/hooks';
import {Colors} from '../utils/colors';
import {join} from '../utils/join';

export interface TextFieldProps {
  readonly class?: string;
  readonly type?: 'url';
  readonly value: string;
  readonly placeholder?: string;
  readonly autoFocus?: boolean;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly highlight?: boolean;

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
  highlight,
  onInput,
}: TextFieldProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <input
      ref={inputRef}
      class={join([
        className,
        Colors.text(),
        Colors.placeholderText(),
        Colors.border(highlight ? 'highlight' : undefined),
        Colors.background(),
        Colors.focusOutline(),
        disabled && 'opacity-25',
        'appearance-none',
        'rounded-none',
        'w-full',
        'px-2',
      ])}
      type={type ?? 'text'}
      value={value}
      placeholder={placeholder}
      autocomplete="off"
      autocorrect="off"
      disabled={disabled}
      required={required}
      spellcheck={false}
      onInput={useCallback(
        (event: Event) => {
          event.preventDefault();
          onInput((event.target as HTMLInputElement).value ?? '');
        },
        [onInput]
      )}
    />
  );
}
