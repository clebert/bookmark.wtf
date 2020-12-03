import {ReceiverState} from 'loxia';
import * as React from 'react';
import {fetchGistsData} from '../apis/fetch-gists-data';
import {AuthorizedAuthState} from './use-auth';
import {useReceiver} from './use-receiver';

export interface GistOverviewDependencies {
  readonly authState: AuthorizedAuthState;
}

export type GistOverview = readonly GistOverviewItem[];

export interface GistOverviewItem {
  readonly id: string;
  readonly gistName: string;
  readonly description: string;
}

export function useGistOverview(
  dependencies: GistOverviewDependencies
): ReceiverState<GistOverview> {
  const {token} = dependencies.authState;

  return useReceiver(
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
