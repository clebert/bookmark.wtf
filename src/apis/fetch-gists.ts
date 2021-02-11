import {GET_GISTS} from '../queries/get-gists';
import {GetGistsQuery, GetGistsQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';

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

  const result = await client
    .query<GetGistsQuery, GetGistsQueryVariables>(GET_GISTS, {})
    .toPromise();

  if (result.error) {
    throw result.error;
  }

  const data = result.data!.viewer!.gists;
  const gists: ShallowGist[] = [];

  for (const node of data.nodes ?? []) {
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
