import type {GistFile} from './gist-api.js';
import type {GetGistsQuery, GetGistsQueryVariables} from '../queries/types.js';

import {GithubAPI} from './github-api.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import {GET_GISTS} from '../queries/get-gists.js';
import {createGithubClient} from '../utils/create-github-client.js';
import {z} from 'zod';

export interface ShallowGist {
  readonly gistName: string;
  readonly description: string | undefined;
  readonly mtime?: number;
}

export class GistsAPI extends GithubAPI {
  static async init(token: string, mainFile: GistFile): Promise<GistsAPI> {
    const client = createGithubClient(token);

    const {error, data} = await client
      .query<GetGistsQuery, GetGistsQueryVariables>(GET_GISTS, {})
      .toPromise();

    if (error) {
      if (error.response?.status === 401) {
        AppTopics.token.publish(``);
      }

      throw error;
    }

    const {nodes} = data!.viewer.gists;
    const gists: ShallowGist[] = [];

    for (const node of nodes ?? []) {
      if (node?.files?.some((file) => file?.name === mainFile.filename)) {
        gists.push({
          gistName: node.name,
          description: node.description?.trim() || undefined,
        });
      }
    }

    return new GistsAPI(token, mainFile, gists);
  }

  readonly #mainFile: GistFile;

  #gists: readonly ShallowGist[];

  protected constructor(
    token: string,
    mainFile: GistFile,
    gists: readonly ShallowGist[],
  ) {
    super(token);

    this.#mainFile = mainFile;
    this.#gists = gists;
  }

  get gists(): readonly ShallowGist[] {
    return this.#gists;
  }

  async createGist(description: string): Promise<void> {
    const {data} = await this.fetch({
      method: `POST`,
      pathname: `/gists`,
      params: {
        description,
        files: {[this.#mainFile.filename]: {content: this.#mainFile.text}},
      },
    });

    const {id} = z.object({id: z.string()}).parse(data);

    this.#gists = [
      {gistName: id, description, mtime: Date.now()},
      ...this.#gists,
    ];
  }

  async updateGist(gistName: string, description: string): Promise<void> {
    const gist = this.#gists.find(
      (otherGist) => otherGist.gistName === gistName,
    );

    if (!gist) {
      throw new Error(`Failed to update gist.`);
    }

    this.#gists = [
      {...gist, description, mtime: Date.now()},
      ...this.#gists.filter((otherGist) => otherGist.gistName !== gistName),
    ];

    await this.fetch({
      method: `PATCH`,
      pathname: `/gists/${gistName}`,
      params: {description},
    });
  }

  async deleteGist(gistName: string): Promise<void> {
    this.#gists = [...this.#gists.filter((gist) => gist.gistName !== gistName)];

    await this.fetch({
      method: `DELETE`,
      pathname: `/gists/${gistName}`,
      params: {},
    });
  }
}
