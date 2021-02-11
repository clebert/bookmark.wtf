import {GET_USER} from '../queries/get-user';
import {GetUserQuery, GetUserQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';

export async function fetchUser(token: string): Promise<string> {
  const client = createGithubClient(token);

  const result = await client
    .query<GetUserQuery, GetUserQueryVariables>(GET_USER, {})
    .toPromise();

  if (result.error) {
    throw result.error;
  }

  return result.data!.viewer.login;
}
