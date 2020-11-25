import React from 'react';
import {fetchGistData} from '../apis/fetch-gist-data';
import {GetGist_viewer_gist} from '../queries/__generated__/GetGist';
import {AuthorizedAuthState} from './use-auth-state';
import {SetGistNameState} from './use-gist-name-state';
import {ReceiverState, useReceiverState} from './use-receiver-state';

export function useGistDataState(
  authState: AuthorizedAuthState,
  gistNameState: SetGistNameState
): ReceiverState<GetGist_viewer_gist> {
  const {token} = authState;
  const {gistName} = gistNameState;

  return useReceiverState(
    React.useMemo(() => fetchGistData(token, gistName), [token, gistName])
  );
}
