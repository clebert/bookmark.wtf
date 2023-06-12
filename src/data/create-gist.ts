import {fetchGithubApi} from '../utils/fetch-github-api.js';
import {z} from 'zod';

export interface CreateGistParams {
  readonly token: string;
  readonly description: string;
  readonly files: Readonly<Record<string, {readonly content: string}>>;
}

export async function createGist({
  token,
  description,
  files,
}: CreateGistParams): Promise<{gistName: string}> {
  const {data} = await fetchGithubApi({
    method: `POST`,
    pathname: `/gists`,
    params: {description, files},
    token,
  });

  return {gistName: z.object({id: z.string()}).parse(data).id};
}
