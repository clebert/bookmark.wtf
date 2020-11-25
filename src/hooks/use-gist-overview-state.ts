import React from 'react';
import {fetchGistsData} from '../apis/fetch-gists-data';
import {AuthorizedAuthState} from './use-auth-state';
import {ReceiverState, useReceiverState} from './use-receiver-state';

export type GistOverview = readonly GistOverviewItem[];

export interface GistOverviewItem {
  readonly id: string;
  readonly gistName: string;
  readonly description: string;
}

export function useGistOverviewState(
  authState: AuthorizedAuthState
): ReceiverState<GistOverview> {
  const {token} = authState;

  return useReceiverState(
    React.useMemo(
      () =>
        fetchGistsData(token).then(({nodes}) => {
          const items: GistOverviewItem[] = [];

          for (const node of nodes ?? []) {
            if (node) {
              items.push({
                id: node.id,
                gistName: node.name,
                description: node.description || node.name,
              });
            }
          }

          return items;
        }),
      [token]
    )
  );
}
