import type {GetGistQuery, GetGistQueryVariables} from '../queries/types.js';

import {GET_GIST} from '../queries/get-gist.js';
import {createGithubClient} from '../utils/create-github-client.js';

export interface ReadGistParams {
  readonly token: string;
  readonly gistName: string;
}

export async function readGist({token, gistName}: ReadGistParams): Promise<{
  gist: {owner: string; description: string; files: Record<string, {content: string}>};
}> {
  const client = createGithubClient(token);

  const {error, data} = await client
    .query<GetGistQuery, GetGistQueryVariables>(GET_GIST, {gistName})
    .toPromise();

  if (error) {
    throw error;
  }

  const {gist} = data!.viewer;

  if (!gist || !gist.owner) {
    throw new Error(`Invalid gist data.`);
  }

  const files: Record<string, {content: string}> = {};

  for (const file of gist.files ?? []) {
    if (file && file.name && file.text && !file.isTruncated) {
      files[file.name] = {content: file.text};
    }
  }

  return {
    gist: {owner: gist.owner.login, description: gist.description ?? ``, files},
  };
}
