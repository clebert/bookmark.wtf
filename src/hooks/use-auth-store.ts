import {useMemo, useState} from 'preact/hooks';
import {AppStorage} from '../singletons/app-storage';
import {beginAuthorization} from '../utils/begin-authorization';
import {useTransition} from './use-transition';

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
  const token = AppStorage.singleton.useToken();
  const [authorizing, setAuthorizing] = useState(false);
  const transition = useTransition(token, authorizing);

  const signIn = () =>
    transition(() => {
      setAuthorizing(true);
      beginAuthorization();
    });

  const signOut = () =>
    transition(() => AppStorage.singleton.setToken(undefined));

  return useMemo(
    () =>
      token
        ? {state: 'authorized', token, signOut}
        : authorizing
        ? {state: 'authorizing'}
        : {state: 'unauthorized', signIn},
    [transition]
  );
}
