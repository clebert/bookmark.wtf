import type {
  Snapshot,
  Store,
  TransitionsMap,
  ValueSchemaMap,
} from 'state-guard';

import * as React from 'react';

export function useStore<
  TValueSchemaMap extends ValueSchemaMap,
  TTransitionsMap extends TransitionsMap<TValueSchemaMap>,
  TExpectedState extends keyof TValueSchemaMap | undefined = undefined,
>(
  store: Store<TValueSchemaMap, TTransitionsMap>,
  expectedState?: TExpectedState,
): TExpectedState extends keyof TValueSchemaMap
  ? Snapshot<TValueSchemaMap, TTransitionsMap, TExpectedState> | undefined
  : {
      [TState in keyof TValueSchemaMap]: Snapshot<
        TValueSchemaMap,
        TTransitionsMap,
        TState
      >;
    }[keyof TValueSchemaMap] {
  return React.useSyncExternalStore(store.subscribe, () =>
    store.get(expectedState),
  );
}
