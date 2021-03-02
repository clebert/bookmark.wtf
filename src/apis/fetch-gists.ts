import {GET_GISTS} from '../queries/get-gists';
import {GetGistsQuery, GetGistsQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';
import {deauthorize} from '../utils/deauthorize';

export interface ShallowGist {
  readonly gistName: string;
  readonly description: string | undefined;
  readonly filenames: readonly string[];
  readonly mtime?: number;
}

export async function fetchGists(
  token: string
): Promise<readonly ShallowGist[]> {
  const client = createGithubClient(token);

  const {error, data} = await client
    .query<GetGistsQuery, GetGistsQueryVariables>(GET_GISTS, {})
    .toPromise();

  if (error) {
    if (error.response?.status === 401) {
      deauthorize();
    }

    throw error;
  }

  const {nodes} = data!.viewer!.gists;
  const gists: ShallowGist[] = [];

  for (const node of nodes ?? []) {
    if (node) {
      const filenames: string[] = [];

      for (const file of node.files ?? []) {
        if (file?.name) {
          filenames.push(file.name);
        }
      }

      gists.push({
        gistName: node.name,
        description: node.description?.trim() || undefined,
        filenames,
      });
    }
  }

  return gists;
}
