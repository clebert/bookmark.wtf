import type {GetGistsQuery, GetGistsQueryVariables} from '../queries/types.js';

import {GET_GISTS} from '../queries/get-gists.js';
import {createGithubClient} from '../utils/create-github-client.js';

export interface ReadGistsParams {
  readonly token: string;
  readonly filenameFilter: string;
}

export async function readGists({token, filenameFilter}: ReadGistsParams): Promise<{
  gists: {gistName: string; description: string}[];
}> {
  const client = createGithubClient(token);

  const {error, data} = await client
    .query<GetGistsQuery, GetGistsQueryVariables>(GET_GISTS, {})
    .toPromise();

  if (error) {
    throw error;
  }

  const gists: {gistName: string; description: string}[] = [];

  for (const node of data!.viewer.gists.nodes ?? []) {
    if (node?.files?.some((file) => file?.name === filenameFilter)) {
      gists.push({
        gistName: node.name,
        description: node.description?.trim() ?? ``,
      });
    }
  }

  return {gists};
}
