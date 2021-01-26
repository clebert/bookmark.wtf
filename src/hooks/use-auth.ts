import cookie from 'cookie';
import {useEffect, useMemo, useState} from 'preact/hooks';
import {assertIsString} from '../utils/assert-is-string';
import {createRandomValue} from '../utils/create-random-value';
import {useTransition} from './use-transition';

export type AuthState =
  | AuthorizedAuthState
  | AuthorizingAuthState
  | UnauthorizedAuthState;

export type AuthorizedAuthState = {
  readonly status: 'authorized';
  readonly token: string;
  readonly signIn?: undefined;
  readonly signOut: () => void;
};

export type AuthorizingAuthState = {
  readonly status: 'authorizing';
  readonly token?: undefined;
  readonly signIn?: undefined;
  readonly signOut?: undefined;
};

export type UnauthorizedAuthState = {
  readonly status: 'unauthorized';
  readonly token?: undefined;
  readonly signIn: () => void;
  readonly signOut?: undefined;
};

export function useAuth(): AuthState {
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

  const signIn = useTransition(() => {
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
  }, []);

  const signOut = useTransition(() => setToken(undefined), []);

  return useMemo(
    () =>
      token
        ? {status: 'authorized', token, signOut}
        : authorizing
        ? {status: 'authorizing'}
        : {status: 'unauthorized', signIn},
    [token, authorizing]
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
