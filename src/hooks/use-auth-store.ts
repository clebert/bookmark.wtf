import {useTransition} from './use-transition.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import {beginAuthorization} from '../utils/begin-authorization.js';
import * as React from 'react';

export type AuthStore =
  | AuthorizedAuthStore
  | AuthorizingAuthStore
  | UnauthorizedAuthStore;

export type AuthorizedAuthStore = {
  readonly state: 'authorized';
  readonly token: string;

  signOut(): boolean;
};

export type AuthorizingAuthStore = {
  readonly state: 'authorizing';
};

export type UnauthorizedAuthStore = {
  readonly state: 'unauthorized';

  signIn(): boolean;
};

export function useAuthStore(): AuthStore {
  const token = AppTopics.token.use();
  const [authorizing, setAuthorizing] = React.useState(false);
  const transition = useTransition(token, authorizing);

  const signIn = () =>
    transition(() => {
      setAuthorizing(true);
      beginAuthorization();
    });

  const signOut = () => transition(() => AppTopics.token.publish(``));

  return React.useMemo(
    () =>
      token
        ? {state: `authorized`, token, signOut}
        : authorizing
        ? {state: `authorizing`}
        : {state: `unauthorized`, signIn},
    [transition],
  );
}
