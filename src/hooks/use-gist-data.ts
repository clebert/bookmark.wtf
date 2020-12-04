import {ReceiverState} from 'loxia';
import * as React from 'react';
import {GistData, fetchGistData} from '../apis/fetch-gist-data';
import {AuthorizedAuthState} from './use-auth';
import {SetGistNameState} from './use-gist-name';
import {useReceiver} from './use-receiver';

export interface GistDataDependencies {
  readonly authState: AuthorizedAuthState;
  readonly gistNameState: SetGistNameState;
}

export function useGistData(
  dependencies: GistDataDependencies
): ReceiverState<GistData> {
  const {
    authState: {token},
    gistNameState: {gistName},
  } = dependencies;

  return useReceiver(
    React.useMemo(() => fetchGistData(token, gistName), [token, gistName])
  );
}
