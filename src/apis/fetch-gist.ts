import {GET_GIST} from '../queries/get-gist';
import {GetGistQuery, GetGistQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';

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

  const result = await client
    .query<GetGistQuery, GetGistQueryVariables>(GET_GIST, {gistName})
    .toPromise();

  if (result.error) {
    throw result.error;
  }

  const data = result.data!.viewer!.gist!;
  const files: GistFile[] = [];

  for (const file of data.files ?? []) {
    if (file && file.name && file.text && !file.isTruncated) {
      files.push({filename: file.name, text: file.text});
    }
  }

  return {
    owner: data.owner!.login,
    description: data.description?.trim() || undefined,
    files,
  };
}
