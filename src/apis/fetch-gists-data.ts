import {GET_GISTS} from '../queries/get-gists';
import {GetGistsQuery, GetGistsQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';

export type GistsData = Exclude<
  GetGistsQuery['viewer']['gists'],
  undefined | null
>;

export async function fetchGistsData(token: string): Promise<GistsData> {
  const client = createGithubClient(token);

  const result = await client
    .query<GetGistsQuery, GetGistsQueryVariables>(GET_GISTS, {})
    .toPromise();

  if (result.error) {
    throw result.error;
  }

  const gistsData = result.data?.viewer?.gists;

  if (!gistsData) {
    throw new Error('Gists data not found.');
  }

  return gistsData;
}
