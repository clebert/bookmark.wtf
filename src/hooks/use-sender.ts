import React from 'react';

export type SenderState =
  | IdleSenderState
  | SendingSenderState
  | FailedSenderState;

export interface IdleSenderState {
  readonly status: 'idle';
  readonly error?: undefined;

  readonly send: <TValue>(
    signal: Promise<TValue>,
    effect?: Effect<TValue>
  ) => void;
}

export interface SendingSenderState {
  readonly status: 'sending';
  readonly error?: undefined;
  readonly send?: undefined;
}

export interface FailedSenderState {
  readonly status: 'failed';
  readonly error: Error;

  readonly send: <TValue>(
    signal: Promise<TValue>,
    effect?: Effect<TValue>
  ) => void;
}

export type Effect<TValue> = (value: TValue) => void;

export function useSender(): SenderState {
  const mountedRef = React.useRef(true);

  React.useEffect(() => () => void (mountedRef.current = false), []);

  const [sending, setSending] = React.useState(false);
  const [sendingError, setSendingError] = React.useState<Error | undefined>();

  const send = React.useCallback<IdleSenderState['send']>((signal, effect) => {
    setSending((prevSending) => {
      if (prevSending) {
        throw new Error('A signal is already being sent.');
      }

      return true;
    });

    signal
      .then((value) => {
        if (mountedRef.current) {
          setSending(false);
          setSendingError(undefined);
          effect?.(value);
        }
      })
      .catch((error) => {
        if (mountedRef.current) {
          setSending(false);
          setSendingError(error);
        }
      });
  }, []);

  return React.useMemo(
    () =>
      sending
        ? {status: 'sending'}
        : sendingError
        ? {status: 'failed', error: sendingError, send}
        : {status: 'idle', send},
    [sending, sendingError]
  );
}
