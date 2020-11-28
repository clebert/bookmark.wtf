import cookie from 'cookie';
import React from 'react';
import {assertIsString} from '../utils/assert-is-string';
import {createRandomValue} from '../utils/create-random-value';

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
  const [token, setToken] = React.useState(
    localStorage.getItem('token') ?? undefined
  );

  React.useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const [authorizing, setAuthorizing] = React.useState(false);

  const signIn = React.useCallback(() => {
    setAuthorizing((prevAuthorizing) => {
      if (prevAuthorizing) {
        throw new Error('The authorization is already in progress.');
      }

      return true;
    });

    const transactionId = createRandomValue();

    document.cookie = cookie.serialize('transactionId', transactionId, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV !== 'development',
    });

    sessionStorage.setItem('originalPathname', window.location.pathname);

    const clientId = process.env.CLIENT_ID;

    assertIsString(clientId, 'process.env.CLIENT_ID');

    const url = new URL('https://github.com/login/oauth/authorize');

    url.searchParams.set('client_id', clientId);
    url.searchParams.set('scope', 'gist');
    url.searchParams.set('state', transactionId);

    window.location.href = url.href;
  }, []);

  const signOut = React.useCallback(() => setToken(undefined), []);

  return React.useMemo(
    () =>
      token
        ? {status: 'authorized', token, signOut}
        : authorizing
        ? {status: 'authorizing'}
        : {status: 'unauthorized', signIn},
    [token, authorizing, signIn]
  );
}

function handleTransaction(): void {
  const searchParams = new URLSearchParams(window.location.search);
  const tokenParam = searchParams.get('token');

  if (tokenParam) {
    window.history.replaceState(
      undefined,
      '',
      sessionStorage.getItem('originalPathname') ?? window.location.pathname
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
