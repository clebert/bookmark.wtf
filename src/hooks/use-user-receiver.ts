import {Receiver} from 'loxia';
import {useMemo} from 'preact/hooks';
import {fetchUser} from '../apis/fetch-user';
import {useReceiver} from './use-receiver';

export function useUserReceiver(token: string): Receiver<string> {
  return useReceiver(useMemo(() => fetchUser(token), [token]));
}
