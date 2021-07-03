import {ComponentChildren, JSX} from 'preact';
import {useCallback} from 'preact/hooks';

export interface FormProps {
  readonly children: ComponentChildren;

  onSubmit?(): void;
}

export function Form({children, onSubmit}: FormProps): JSX.Element {
  return (
    <form
      onSubmit={useCallback(
        (event: Event) => {
          event.preventDefault();
          onSubmit?.();
        },
        [onSubmit]
      )}
    >
      {children}
    </form>
  );
}
