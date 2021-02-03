import {Receiver} from 'loxia';
import {useMemo} from 'preact/hooks';
import {fetchGistsData} from '../apis/fetch-gists-data';
import {AuthorizedAuth} from './use-auth';
import {useReceiver} from './use-receiver';

export interface GistOverviewReceiverDependencies {
  readonly auth: AuthorizedAuth;
}

export type GistOverview = readonly GistOverviewItem[];

export interface GistOverviewItem {
  readonly id: string;
  readonly gistName: string;
  readonly description: string;
}

export function useGistOverviewReceiver(
  dependencies: GistOverviewReceiverDependencies
): Receiver<GistOverview> {
  const {
    auth: {token},
  } = dependencies;

  return useReceiver(
    useMemo(
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
