import type {
  Snapshot,
  Store,
  TransformerMap,
  TransitionsMap,
} from 'state-guard';

import * as React from 'react';

export function useStore<
  TTransformerMap extends TransformerMap,
  TTransitionsMap extends TransitionsMap<TTransformerMap>,
  TExpectedState extends keyof TTransformerMap | undefined = undefined,
>(
  store: Store<TTransformerMap, TTransitionsMap>,
  expectedState?: TExpectedState,
): TExpectedState extends keyof TTransformerMap
  ? Snapshot<TTransformerMap, TTransitionsMap, TExpectedState> | undefined
  : {
      [TState in keyof TTransformerMap]: Snapshot<
        TTransformerMap,
        TTransitionsMap,
        TState
      >;
    }[keyof TTransformerMap] {
  return React.useSyncExternalStore(store.subscribe, () =>
    store.get(expectedState),
  );
}
