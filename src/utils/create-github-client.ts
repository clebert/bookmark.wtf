import {ApolloClient, InMemoryCache} from '@apollo/client/core';

export function createGithubClient(token: string): ApolloClient<unknown> {
  return new ApolloClient({
    uri: 'https://api.github.com/graphql',
    cache: new InMemoryCache(),
    headers: {authorization: `token ${token}`},
  });
}
