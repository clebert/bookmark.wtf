import {JSX, h} from 'preact';
import {useCallback, useEffect, useRef} from 'preact/hooks';
import {join} from '../utils/join';
import {Theme} from '../utils/theme';

export interface InputProps {
  readonly type?: 'url';
  readonly value: string;
  readonly placeholder?: string;
  readonly theme?: Theme;
  readonly autoFocus?: boolean;
  readonly disabled?: boolean;
  readonly required?: boolean;

  onInput(value: string): void;
}

export function Input({
  type,
  value,
  placeholder,
  theme = Theme.default(),
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
      class={join([
        theme.textColor,
        theme.placeholderColor,
        theme.borderColor,
        Theme.outlineColor,
        'placeholder-opacity-25',
        'border',
        'w-full',
        'px-2',
      ])}
    />
  );
}
