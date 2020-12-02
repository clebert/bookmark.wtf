import {ReceiverState} from 'loxia';
import React from 'react';
import {fetchGistData} from '../apis/fetch-gist-data';
import {GetGist_viewer_gist} from '../queries/__generated__/GetGist';
import {AuthorizedAuthState} from './use-auth';
import {SetGistNameState} from './use-gist-name';
import {useReceiver} from './use-receiver';

export interface GistDataDependencies {
  readonly authState: AuthorizedAuthState;
  readonly gistNameState: SetGistNameState;
}

export function useGistData(
  dependencies: GistDataDependencies
): ReceiverState<GetGist_viewer_gist> {
  const {
    authState: {token},
    gistNameState: {gistName},
  } = dependencies;

  return useReceiver(
    React.useMemo(() => fetchGistData(token, gistName), [token, gistName])
  );
}
