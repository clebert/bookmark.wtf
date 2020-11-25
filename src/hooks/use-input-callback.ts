import React from 'react';

export function useInputCallback(
  callback: (value: string) => void
): React.ChangeEventHandler<HTMLInputElement> {
  return React.useCallback((event) => callback(event.currentTarget.value), [
    callback,
  ]);
}
