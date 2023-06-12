import {fetchGithubApi} from '../utils/fetch-github-api.js';
import {z} from 'zod';

export interface ForkGistParams {
  readonly token: string;
  readonly gistName: string;
}

export async function forkGist({token, gistName}: ForkGistParams): Promise<{newGistName: string}> {
  const {data} = await fetchGithubApi({
    method: `POST`,
    pathname: `/gists/${gistName}/forks`,
    params: {},
    token,
  });

  return {newGistName: z.object({id: z.string()}).parse(data).id};
}
