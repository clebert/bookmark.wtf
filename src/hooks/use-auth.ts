import cookie from 'cookie';
import {useCallback, useEffect, useMemo, useState} from 'preact/hooks';
import {assertIsString} from '../utils/assert-is-string';
import {createRandomValue} from '../utils/create-random-value';
import {useTransition} from './use-transition';

export type Auth = AuthorizedAuth | AuthorizingAuth | UnauthorizedAuth;

export type AuthorizedAuth = {
  readonly state: 'authorized';
  readonly token: string;
  readonly signIn?: undefined;

  signOut(): boolean;
};

export type AuthorizingAuth = {
  readonly state: 'authorizing';
  readonly token?: undefined;
  readonly signIn?: undefined;
  readonly signOut?: undefined;
};

export type UnauthorizedAuth = {
  readonly state: 'unauthorized';
  readonly token?: undefined;
  readonly signOut?: undefined;

  signIn(): boolean;
};

export function useAuth(): Auth {
  const [token, setToken] = useState(
    localStorage.getItem('token') ?? undefined
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const [authorizing, setAuthorizing] = useState(false);
  const transition = useTransition(token, authorizing);

  const signIn = useCallback(
    () =>
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

        const clientId = process.env.CLIENT_ID;

        assertIsString(clientId, 'process.env.CLIENT_ID');

        const url = new URL('https://github.com/login/oauth/authorize');

        url.searchParams.set('client_id', clientId);
        url.searchParams.set('scope', 'gist');
        url.searchParams.set('state', transactionId);

        window.location.href = url.href;
      }),
    [transition]
  );

  const signOut = useCallback(() => transition(() => setToken(undefined)), [
    transition,
  ]);

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
