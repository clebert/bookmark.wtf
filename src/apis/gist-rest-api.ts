import {assertIsString} from '../utils/assert-is-string';
import {fetchGithubApi} from '../utils/fetch-github-api';

export class GistRestApi {
  constructor(readonly token: string) {}

  async createGist(
    description: string,
    files: Readonly<Record<string, string>>
  ): Promise<string> {
    const {data} = await fetchGithubApi<{readonly id: string}>({
      method: 'POST',
      pathname: '/gists',
      params: {
        description,
        files: Object.entries(files).reduce((accu, [filename, text]) => {
          accu[filename] = {content: text};

          return accu;
        }, {} as Record<string, {content: string}>),
      },
      token: this.token,
    });

    const gistName = data?.id;

    assertIsString(gistName, 'gistName');

    return gistName;
  }

  async updateGist(gistName: string, description: string): Promise<void> {
    await fetchGithubApi({
      method: 'PATCH',
      pathname: `/gists/${gistName}`,
      params: {description},
      token: this.token,
    });
  }

  async deleteGist(gistName: string): Promise<void> {
    await fetchGithubApi({
      method: 'DELETE',
      pathname: `/gists/${gistName}`,
      params: {},
      token: this.token,
    });
  }

  async updateFile(
    gistName: string,
    filename: string,
    text: string
  ): Promise<void> {
    await fetchGithubApi({
      method: 'PATCH',
      pathname: `/gists/${gistName}`,
      params: {files: {[filename]: {content: text}}},
      token: this.token,
    });
  }

  async deleteFile(gistName: string, filename: string): Promise<void> {
    await fetchGithubApi({
      method: 'PATCH',
      pathname: `/gists/${gistName}`,
      params: {files: {[filename]: null}},
      token: this.token,
    });
  }
}
