import {GET_GIST} from '../queries/get-gist';
import {GetGistQuery, GetGistQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';

export type GistData = Exclude<
  GetGistQuery['viewer']['gist'],
  undefined | null
>;

export async function fetchGistData(
  token: string,
  gistName: string
): Promise<GistData> {
  const client = createGithubClient(token);

  const result = await client
    .query<GetGistQuery, GetGistQueryVariables>(GET_GIST, {gistName})
    .toPromise();

  if (result.error) {
    throw result.error;
  }

  const gistData = result.data?.viewer?.gist;

  if (!gistData) {
    throw new Error('Gist data not found.');
  }

  return gistData;
}
