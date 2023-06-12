import {fetchGithubApi} from '../utils/fetch-github-api.js';

export interface DeleteGistParams {
  readonly token: string;
  readonly gistName: string;
}

export async function deleteGist({token, gistName}: DeleteGistParams): Promise<void> {
  await fetchGithubApi({method: `DELETE`, pathname: `/gists/${gistName}`, params: {}, token});
}
