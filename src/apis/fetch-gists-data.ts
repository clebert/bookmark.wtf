import {
  GetGists,
  GetGists_viewer_gists,
} from '../queries/__generated__/GetGists';
import {GET_GISTS} from '../queries/get-gists';
import {createGithubClient} from '../utils/create-github-client';

export async function fetchGistsData(
  token: string
): Promise<GetGists_viewer_gists> {
  const client = createGithubClient(token);

  try {
    const result = await client.query<GetGists>({
      query: GET_GISTS,
      fetchPolicy: 'network-only',
    });

    if (result.error) {
      throw result.error;
    }

    return result.data.viewer.gists;
  } finally {
    client.stop();
  }
}
