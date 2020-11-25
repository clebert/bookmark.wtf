import React from 'react';
import {fetchUserData} from '../apis/fetch-user-data';
import {AuthorizedAuthState} from './use-auth-state';
import {ReceiverState, useReceiverState} from './use-receiver-state';

export const UserStateContext = React.createContext<ReceiverState<string>>(
  undefined as any
);

export function useUserState(
  authState: AuthorizedAuthState
): ReceiverState<string> {
  const {token} = authState;

  return useReceiverState(
    React.useMemo(() => fetchUserData(token).then(({login}) => login), [token])
  );
}
