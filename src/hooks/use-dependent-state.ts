import {useCallback, useMemo, useState} from 'preact/hooks';
import {useDependentRef} from './use-dependent-ref';

export function useDependentState<TState>(
  initialState: TState | (() => TState),
  dependencies: readonly unknown[]
): [TState, (value: TState) => void] {
  const [, rerender] = useState({});

  const stateRef = useDependentRef(
    useMemo(
      () =>
        typeof initialState === 'function'
          ? (initialState as () => TState)()
          : initialState,
      dependencies
    ),
    dependencies
  );

  const setState = useCallback(
    (value: TState) => {
      if (stateRef.value !== value) {
        stateRef.value = value;

        rerender({});
      }
    },
    [stateRef]
  );

  return [stateRef.value, setState];
}
