import type {GetUserQuery, GetUserQueryVariables} from '../queries/types.js';

import {AppTopics} from '../pub-sub/app-topics.js';
import {GET_USER} from '../queries/get-user.js';
import {createGithubClient} from '../utils/create-github-client.js';

export class UserAPI {
  static async init(token: string): Promise<UserAPI> {
    const client = createGithubClient(token);

    const {error, data} = await client
      .query<GetUserQuery, GetUserQueryVariables>(GET_USER, {})
      .toPromise();

    if (error) {
      if (error.response?.status === 401) {
        AppTopics.token.publish(``);
      }

      throw error;
    }

    return new UserAPI(data!.viewer.login);
  }

  protected constructor(readonly user: string) {}
}
