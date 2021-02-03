import {Receiver} from 'loxia';
import {useMemo} from 'preact/hooks';
import {GistData, fetchGistData} from '../apis/fetch-gist-data';
import {AuthorizedAuth} from './use-auth';
import {SetGistSelection} from './use-gist-selection';
import {useReceiver} from './use-receiver';

export interface GistDataReceiverDependencies {
  readonly auth: AuthorizedAuth;
  readonly gistSelection: SetGistSelection;
}

export function useGistDataReceiver(
  dependencies: GistDataReceiverDependencies
): Receiver<GistData> {
  const {
    auth: {token},
    gistSelection: {gistName},
  } = dependencies;

  return useReceiver(
    useMemo(() => fetchGistData(token, gistName), [token, gistName])
  );
}
