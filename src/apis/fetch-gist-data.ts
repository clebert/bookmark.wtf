import {
  GetGist,
  GetGistVariables,
  GetGist_viewer_gist,
} from '../queries/__generated__/GetGist';
import {GET_GIST} from '../queries/get-gist';
import {createGithubClient} from '../utils/create-github-client';

export async function fetchGistData(
  token: string,
  gistName: string
): Promise<GetGist_viewer_gist> {
  const client = createGithubClient(token);

  try {
    const result = await client.query<GetGist, GetGistVariables>({
      query: GET_GIST,
      variables: {gistName},
      fetchPolicy: 'network-only',
    });

    if (result.error) {
      throw result.error;
    }

    const {gist: gistData} = result.data.viewer;

    if (!gistData) {
      throw new Error('Gist not found.');
    }

    return gistData;
  } finally {
    client.stop();
  }
}
