import {JSX} from 'preact';
import {useCallback} from 'preact/hooks';

export function useInputCallback(
  callback: (value: string) => void
): JSX.GenericEventHandler<HTMLInputElement> {
  return useCallback((event) => callback(event.currentTarget.value), [
    callback,
  ]);
}
