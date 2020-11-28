import React from 'react';

export type ReceiverState<TValue> =
  | ReceivingReceiverState
  | ReceivedReceiverState<TValue>
  | FailedReceiverState;

export interface ReceivingReceiverState {
  readonly status: 'receiving';
  readonly value?: undefined;
  readonly error?: undefined;
}

export interface ReceivedReceiverState<TValue> {
  readonly status: 'received';
  readonly value: TValue;
  readonly error?: undefined;
}

export interface FailedReceiverState {
  readonly status: 'failed';
  readonly value?: undefined;
  readonly error: Error;
}

export function useReceiver<TValue>(
  signal: Promise<TValue>
): ReceiverState<TValue> {
  const mountedRef = React.useRef(true);

  React.useEffect(() => () => void (mountedRef.current = false), []);

  const [result, setResult] = React.useState<
    | {ok: true; value: TValue; signal: Promise<TValue>}
    | {ok: false; error: Error; signal: Promise<TValue>}
    | undefined
  >();

  React.useEffect(() => {
    signal
      ?.then((value) => {
        if (mountedRef.current) {
          setResult({ok: true, value, signal});
        }
      })
      .catch((error) => {
        if (mountedRef.current) {
          setResult({ok: false, error, signal});
        }
      });
  }, [signal]);

  return React.useMemo(() => {
    if (signal === result?.signal) {
      return result.ok
        ? {status: 'received', value: result.value}
        : {status: 'failed', error: result.error};
    }

    return {status: 'receiving'};
  }, [signal, result]);
}
