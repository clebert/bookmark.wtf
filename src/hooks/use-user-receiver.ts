import {Receiver} from 'loxia';
import {useMemo} from 'preact/hooks';
import {fetchUser} from '../apis/fetch-user';
import {AuthorizedAuthStore} from './use-auth-store';
import {useReceiver} from './use-receiver';

export function useUserReceiver(
  authStore: AuthorizedAuthStore
): Receiver<string> {
  return useReceiver(useMemo(() => fetchUser(authStore.token), [authStore]));
}
