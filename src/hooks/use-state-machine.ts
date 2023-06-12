import type {StateMachine, TransformerMap, TransitionsMap} from 'state-guard';

import * as React from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useStateMachine<
  TTransformerMap extends TransformerMap,
  TTransitionsMap extends TransitionsMap<TTransformerMap>,
  TExpectedState extends keyof TTransformerMap | undefined = undefined,
>(
  stateMachine: StateMachine<TTransformerMap, TTransitionsMap>,
  expectedState?: TExpectedState,
) {
  return React.useSyncExternalStore(stateMachine.subscribe, () =>
    stateMachine.get(expectedState),
  );
}
