import {app} from './app.js';
import {github} from './github.js';
import {Session} from './session.js';
import {assertIsString} from '../utils/assert-is-string.js';
import {expect, test as setup} from '@playwright/test';
import {env} from 'node:process';
import speakeasy from 'speakeasy';

setup(`signing in`, async ({browser, page}) => {
  const session = new Session(browser, page);
  const login = env.E2E_TEST_LOGIN;
  const password = env.E2E_TEST_PASSWORD;
  const secret = env.E2E_TEST_SECRET;

  assertIsString(login, `E2E_TEST_LOGIN`);
  assertIsString(password, `E2E_TEST_PASSWORD`);
  assertIsString(secret, `E2E_TEST_SECRET`);

  const url = `/9803bde974539a8992c0515b28db439b?foo=bar`;

  await session.page.goto(url);
  await session.click(app.topbar.signInButton);
  await session.fill(github.loginField, login);
  await session.fill(github.passwordField, password);
  await session.click(github.primaryButton);

  await session.fill(
    github.otpField,
    speakeasy.totp({secret, encoding: `base32`}),
  );

  await session.exists(app.topbar.signOutButton);

  expect(session.page.url()).toContain(url);

  await page.context().storageState({path: `playwright/.auth/user.json`});
});
