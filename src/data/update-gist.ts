import {fetchGithubApi} from '../utils/fetch-github-api.js';

export interface UpdateGistParams {
  readonly token: string;
  readonly gistName: string;
  readonly description?: string;
  readonly files?: Readonly<Record<string, {readonly content: string} | null>>;
}

export async function updateGist({
  token,
  gistName,
  description,
  files,
}: UpdateGistParams): Promise<void> {
  await fetchGithubApi({
    method: `PATCH`,
    pathname: `/gists/${gistName}`,
    params: {description, files},
    token,
  });
}
