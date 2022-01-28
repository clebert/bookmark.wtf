import cookie from 'cookie';
import {createRandomValue} from './create-random-value';

export function beginAuthorization(): void {
  const transactionId = createRandomValue();

  document.cookie = cookie.serialize(`transactionId`, transactionId, {
    path: `/`,
    sameSite: `lax`,
    secure: process.env.NODE_ENV !== `development`,
  });

  sessionStorage.setItem(`originalPathname`, window.location.pathname);
  sessionStorage.setItem(`originalSearch`, window.location.search);

  const url = new URL(`https://github.com/login/oauth/authorize`);

  url.searchParams.set(`client_id`, process.env.CLIENT_ID!);
  url.searchParams.set(`scope`, `gist`);
  url.searchParams.set(`state`, transactionId);

  window.location.href = url.href;
}
