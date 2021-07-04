import cookie from 'cookie';
import {useMemo, useState} from 'preact/hooks';
import {AppStorage} from '../singletons/app-storage';
import {createRandomValue} from '../utils/create-random-value';
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

      const transactionId = createRandomValue();

      document.cookie = cookie.serialize('transactionId', transactionId, {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV !== 'development',
      });

      sessionStorage.setItem('originalPathname', window.location.pathname);
      sessionStorage.setItem('originalSearch', window.location.search);

      const url = new URL('https://github.com/login/oauth/authorize');

      url.searchParams.set('client_id', process.env.CLIENT_ID!);
      url.searchParams.set('scope', 'gist');
      url.searchParams.set('state', transactionId);

      window.location.href = url.href;
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

function handleTransaction(): void {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  if (token) {
    const originalPathname =
      sessionStorage.getItem('originalPathname') ?? window.location.pathname;

    const originalSearchParams = new URLSearchParams(
      sessionStorage.getItem('originalSearch') ?? window.location.search
    );

    originalSearchParams.delete('token');
    originalSearchParams.delete('transactionId');

    const originalSearch = originalSearchParams.toString();

    window.history.replaceState(
      undefined,
      '',
      originalSearch
        ? `${originalPathname}?${originalSearch}`
        : originalPathname
    );

    const transactionId = cookie.parse(document.cookie)['transactionId'];

    if (transactionId && searchParams.get('transactionId') === transactionId) {
      AppStorage.singleton.setToken(token);
    } else {
      console.error('Untrusted OAuth transaction.');
    }
  }
}

handleTransaction();
