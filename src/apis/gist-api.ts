import {GET_GIST} from '../queries/get-gist';
import {GetGistQuery, GetGistQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';
import {deauthorize} from '../utils/deauthorize';
import {isObject} from '../utils/is-object';
import {isString} from '../utils/is-string';
import {fetchGithubAPI} from './fetch-github-api';

export interface Gist {
  readonly owner: string;
  readonly description: string | undefined;
  readonly files: readonly GistFile[];
}

export interface GistFile {
  readonly filename: string;
  readonly text: string;
}

export class GistAPI {
  static async init(token: string, gistName: string): Promise<GistAPI> {
    const client = createGithubClient(token);

    const {error, data} = await client
      .query<GetGistQuery, GetGistQueryVariables>(GET_GIST, {gistName})
      .toPromise();

    if (error) {
      if (error.response?.status === 401) {
        deauthorize();
      }

      throw error;
    }

    return new GistAPI(token, gistName, data!);
  }

  #gist: Gist;

  constructor(
    readonly token: string,
    readonly gistName: string,
    data: GetGistQuery
  ) {
    const {gist} = data.viewer;

    if (!gist || !gist.owner) {
      throw new Error('Failed to fetch gist.');
    }

    const files: GistFile[] = [];

    for (const file of gist.files ?? []) {
      if (file && file.name && file.text && !file.isTruncated) {
        files.push({filename: file.name, text: file.text});
      }
    }

    this.#gist = {
      owner: gist.owner.login,
      description: gist.description?.trim() || undefined,
      files,
    };
  }

  get gist(): Gist {
    return this.#gist;
  }

  async createFile(filename: string, text: string): Promise<void> {
    this.#gist = {
      ...this.#gist,
      files: [{filename, text}, ...this.#gist.files],
    };

    await fetchGithubAPI({
      method: 'PATCH',
      pathname: `/gists/${this.gistName}`,
      params: {files: {[filename]: {content: text}}},
      token: this.token,
    });
  }

  async updateFile(
    filename: string,
    text: string,
    skipLocalUpdate: boolean | undefined
  ): Promise<void> {
    if (!skipLocalUpdate) {
      this.#gist = {
        ...this.#gist,
        files: [
          {filename, text},
          ...this.#gist.files.filter((file) => file.filename !== filename),
        ],
      };
    }

    await fetchGithubAPI({
      method: 'PATCH',
      pathname: `/gists/${this.gistName}`,
      params: {files: {[filename]: {content: text}}},
      token: this.token,
    });
  }

  async deleteFile(filename: string): Promise<void> {
    this.#gist = {
      ...this.#gist,
      files: this.#gist.files.filter((file) => file.filename !== filename),
    };

    await fetchGithubAPI({
      method: 'PATCH',
      pathname: `/gists/${this.gistName}`,
      params: {files: {[filename]: null}},
      token: this.token,
    });
  }

  async fork(): Promise<string> {
    const {data} = await fetchGithubAPI({
      method: 'POST',
      pathname: `/gists/${this.gistName}/forks`,
      params: {},
      token: this.token,
    });

    if (!isObject(data) || !isString(data.id)) {
      throw new Error('Failed to fork gist.');
    }

    return data.id;
  }
}
