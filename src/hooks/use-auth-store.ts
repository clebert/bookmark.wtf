import cookie from 'cookie';
import {useEffect, useMemo, useState} from 'preact/hooks';
import {createRandomValue} from '../utils/create-random-value';
import {deauthorize} from '../utils/deauthorize';
import {useTransition} from './use-transition';

export type AuthStore =
  | AuthorizedAuthStore
  | AuthorizingAuthStore
  | UnauthorizedAuthStore;

export type AuthorizedAuthStore = {
  readonly state: 'authorized';
  readonly token: string;
  readonly signIn?: undefined;

  signOut(): boolean;
};

export type AuthorizingAuthStore = {
  readonly state: 'authorizing';
  readonly token?: undefined;
  readonly signIn?: undefined;
  readonly signOut?: undefined;
};

export type UnauthorizedAuthStore = {
  readonly state: 'unauthorized';
  readonly token?: undefined;
  readonly signOut?: undefined;

  signIn(): boolean;
};

export function useAuthStore(): AuthStore {
  const [token, setToken] = useState(
    localStorage.getItem('token') ?? undefined
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      deauthorize();
    }
  }, [token]);

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

  const signOut = () => transition(() => setToken(undefined));

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
  const tokenParam = searchParams.get('token');

  if (tokenParam) {
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

    const transactionIdParam = searchParams.get('transactionId');
    const transactionId = cookie.parse(document.cookie)['transactionId'];

    if (transactionIdParam && transactionIdParam === transactionId) {
      localStorage.setItem('token', tokenParam);
    } else {
      console.error('Untrusted OAuth transaction.');
    }
  }
}

handleTransaction();
