import {useCallback, useState} from 'preact/hooks';
import {useDependentRef} from './use-dependent-ref';

export function useDependentState<TState>(
  initialState: TState,
  dependencies: readonly unknown[]
): [TState, (value: TState) => void] {
  const [, rerender] = useState({});
  const stateRef = useDependentRef(initialState, dependencies);

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
