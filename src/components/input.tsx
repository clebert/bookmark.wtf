import {JSX, h} from 'preact';
import {useCallback, useEffect, useRef} from 'preact/hooks';
import {Colors} from '../utils/colors';
import {join} from '../utils/join';

export interface InputProps {
  readonly class?: string;
  readonly type?: 'url';
  readonly value: string;
  readonly placeholder?: string;
  readonly autoFocus?: boolean;
  readonly disabled?: boolean;
  readonly required?: boolean;

  onInput(value: string): void;
}

export function Input({
  class: className,
  type,
  value,
  placeholder,
  autoFocus,
  required,
  onInput,
}: InputProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement | null>(null);

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
        Colors.border(),
        Colors.background(),
        Colors.focusOutline(),
        'appearance-none',
        'rounded-none',
        'w-full',
        'px-2',
      ])}
      type={type}
      value={value}
      placeholder={placeholder}
      autocomplete="off"
      autocorrect="off"
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
