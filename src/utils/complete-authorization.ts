import cookie from 'cookie';
import {AppStorage} from '../pub-sub/app-storage';

export function completeAuthorization(): void {
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
