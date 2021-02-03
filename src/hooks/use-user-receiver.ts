import {Receiver} from 'loxia';
import {createContext} from 'preact';
import {useMemo} from 'preact/hooks';
import {fetchUserData} from '../apis/fetch-user-data';
import {AuthorizedAuth} from './use-auth';
import {useReceiver} from './use-receiver';

export interface UserReceiverDependencies {
  readonly auth: AuthorizedAuth;
}

export const UserReceiverContext = createContext<Receiver<string>>(
  undefined as any
);

export function useUserReceiver(
  dependencies: UserReceiverDependencies
): Receiver<string> {
  const {token} = dependencies.auth;

  return useReceiver(
    useMemo(() => fetchUserData(token).then(({login}) => login), [token])
  );
}
