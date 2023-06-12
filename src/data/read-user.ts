import type {GetUserQuery, GetUserQueryVariables} from '../queries/types.js';

import {GET_USER} from '../queries/get-user.js';
import {createGithubClient} from '../utils/create-github-client.js';

export interface ReadUserParams {
  readonly token: string;
}

export async function readUser({token}: ReadUserParams): Promise<{user: string}> {
  const client = createGithubClient(token);

  const {error, data} = await client
    .query<GetUserQuery, GetUserQueryVariables>(GET_USER, {})
    .toPromise();

  if (error) {
    throw error;
  }

  return {user: data!.viewer.login};
}
