import {GET_USER} from '../queries/get-user';
import {GetUserQuery, GetUserQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';

export type UserData = Exclude<GetUserQuery['viewer'], undefined | null>;

export async function fetchUserData(token: string): Promise<UserData> {
  const client = createGithubClient(token);

  const result = await client
    .query<GetUserQuery, GetUserQueryVariables>(GET_USER, {})
    .toPromise();

  if (result.error) {
    throw result.error;
  }

  const userData = result.data?.viewer;

  if (!userData) {
    throw new Error('User data not found.');
  }

  return userData;
}
