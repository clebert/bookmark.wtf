import {GET_GIST} from '../queries/get-gist';
import {GetGistQuery, GetGistQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';
import {deauthorize} from '../utils/deauthorize';

export interface Gist {
  readonly owner: string;
  readonly description: string | undefined;
  readonly files: readonly GistFile[];
}

export interface GistFile {
  readonly filename: string;
  readonly text: string;
}

export async function fetchGist(
  token: string,
  gistName: string
): Promise<Gist> {
  const client = createGithubClient(token);

  const {error, data} = await client
    .query<GetGistQuery, GetGistQueryVariables>(GET_GIST, {gistName})
    .toPromise();

  if (error) {
    if (error.response?.status === 401) {
      deauthorize();
    }

    throw error;
  }

  const gist = data!.viewer!.gist!;
  const files: GistFile[] = [];

  for (const file of gist.files ?? []) {
    if (file && file.name && file.text && !file.isTruncated) {
      files.push({filename: file.name, text: file.text});
    }
  }

  return {
    owner: gist.owner!.login,
    description: gist.description?.trim() || undefined,
    files,
  };
}
