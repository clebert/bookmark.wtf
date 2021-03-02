import {useMemo} from 'preact/hooks';

export function useMemory<TValue>(
  initialValue: TValue,
  dependencies: readonly unknown[]
): {value: TValue} {
  return useMemo(() => ({value: initialValue}), dependencies);
}
