import {ReceiverState} from 'loxia';
import React from 'react';
import {fetchUserData} from '../apis/fetch-user-data';
import {AuthorizedAuthState} from './use-auth';
import {useReceiver} from './use-receiver';

export interface UserDependencies {
  readonly authState: AuthorizedAuthState;
}

export const UserContext = React.createContext<ReceiverState<string>>(
  undefined as any
);

export function useUser(dependencies: UserDependencies): ReceiverState<string> {
  const {token} = dependencies.authState;

  return useReceiver(
    React.useMemo(() => fetchUserData(token).then(({login}) => login), [token])
  );
}
