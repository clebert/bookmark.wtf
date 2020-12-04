import {Client} from '@urql/core';

export function createGithubClient(token: string): Client {
  return new Client({
    url: 'https://api.github.com/graphql',
    fetchOptions: {headers: {authorization: `token ${token}`}},
  });
}
