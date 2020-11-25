import {GetUser, GetUser_viewer} from '../queries/__generated__/GetUser';
import {GET_USER} from '../queries/get-user';
import {createGithubClient} from '../utils/create-github-client';

export async function fetchUserData(token: string): Promise<GetUser_viewer> {
  const client = createGithubClient(token);

  try {
    const result = await client.query<GetUser>({
      query: GET_USER,
      fetchPolicy: 'network-only',
    });

    if (result.error) {
      throw result.error;
    }

    return result.data.viewer;
  } finally {
    client.stop();
  }
}
