import {GET_GISTS} from '../queries/get-gists';
import {GetGistsQuery, GetGistsQueryVariables} from '../queries/types';
import {createGithubClient} from '../utils/create-github-client';
import {deauthorize} from '../utils/deauthorize';
import {isObject} from '../utils/is-object';
import {isString} from '../utils/is-string';
import {fetchGithubAPI} from './fetch-github-api';

export interface ShallowGist {
  readonly gistName: string;
  readonly description: string | undefined;
  readonly mtime?: number;
}

export class GistsAPI {
  static async init(token: string, appUrl: string): Promise<GistsAPI> {
    const client = createGithubClient(token);

    const {error, data} = await client
      .query<GetGistsQuery, GetGistsQueryVariables>(GET_GISTS, {})
      .toPromise();

    if (error) {
      if (error.response?.status === 401) {
        deauthorize();
      }

      throw error;
    }

    return new GistsAPI(token, appUrl, data!);
  }

  readonly #mainFilename: string;

  #gists: readonly ShallowGist[];

  constructor(
    readonly token: string,
    readonly appUrl: string,
    data: GetGistsQuery
  ) {
    this.#mainFilename = `.${new URL(appUrl).hostname}.md`;

    const {nodes} = data.viewer.gists;
    const gists: ShallowGist[] = [];

    for (const node of nodes ?? []) {
      if (node?.files?.some((file) => file?.name === this.#mainFilename)) {
        gists.push({
          gistName: node.name,
          description: node.description?.trim() || undefined,
        });
      }
    }

    this.#gists = gists;
  }

  get gists(): readonly ShallowGist[] {
    return this.#gists;
  }

  async createGist(description: string): Promise<void> {
    const {data} = await fetchGithubAPI({
      method: 'POST',
      pathname: '/gists',
      params: {
        description,
        files: {
          [this.#mainFilename]: {
            content: '# This gist is maintained via ' + this.appUrl,
          },
        },
      },
      token: this.token,
    });

    if (!isObject(data) || !isString(data.id)) {
      throw new Error('Failed to create gist.');
    }

    this.#gists = [
      {gistName: data.id, description, mtime: Date.now()},
      ...this.#gists,
    ];
  }

  async updateGist(gistName: string, description: string): Promise<void> {
    const gist = this.#gists.find(
      (otherGist) => otherGist.gistName === gistName
    );

    if (!gist) {
      throw new Error('Failed to update gist.');
    }

    this.#gists = [
      {...gist, description, mtime: Date.now()},
      ...this.#gists.filter((otherGist) => otherGist.gistName !== gistName),
    ];

    await fetchGithubAPI({
      method: 'PATCH',
      pathname: `/gists/${gistName}`,
      params: {description},
      token: this.token,
    });
  }

  async deleteGist(gistName: string): Promise<void> {
    this.#gists = [...this.#gists.filter((gist) => gist.gistName !== gistName)];

    await fetchGithubAPI({
      method: 'DELETE',
      pathname: `/gists/${gistName}`,
      params: {},
      token: this.token,
    });
  }
}
