import {GET_USER} from '../queries/get-user';
import {GetUserQuery, GetUserQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';
import {deauthorize} from '../utils/deauthorize';

export class UserAPI {
  static async init(token: string): Promise<UserAPI> {
    const client = createGithubClient(token);

    const {error, data} = await client
      .query<GetUserQuery, GetUserQueryVariables>(GET_USER, {})
      .toPromise();

    if (error) {
      if (error.response?.status === 401) {
        deauthorize();
      }

      throw error;
    }

    return new UserAPI(data!.viewer.login);
  }

  protected constructor(readonly user: string) {}
}
