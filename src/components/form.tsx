import * as React from 'react';

export interface FormProps extends React.PropsWithChildren {
  onSubmit?(): void;
}

export function Form({children, onSubmit}: FormProps): JSX.Element {
  return (
    <form
      onSubmit={React.useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          onSubmit?.();
        },
        [onSubmit],
      )}
    >
      {children}
    </form>
  );
}
