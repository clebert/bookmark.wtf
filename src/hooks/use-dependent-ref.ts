import {useMemo} from 'preact/hooks';

export function useDependentRef<TValue>(
  initialValue: TValue,
  dependencies: readonly unknown[]
): {value: TValue} {
  return useMemo(() => ({value: initialValue}), dependencies);
}
