import {app} from './app.js';
import {github} from './github.js';
import {Session} from './session.js';
import {assertIsString} from '../src/utils/assert-is-string.js';
import {expect, test as setup} from '@playwright/test';
import process from 'node:process';
import speakeasy from 'speakeasy';

setup(`signing in`, async ({browser, page}) => {
  const session = new Session(browser, page);
  const login = process.env.GITHUB_LOGIN;
  const password = process.env.GITHUB_PASSWORD;
  const secret = process.env.GITHUB_SECRET;

  assertIsString(login, `GITHUB_LOGIN`);
  assertIsString(password, `GITHUB_PASSWORD`);
  assertIsString(secret, `GITHUB_SECRET`);

  const url = `/9803bde974539a8992c0515b28db439b?foo=bar`;

  await session.page.goto(url);
  await session.click(app.topbar.signInButton);
  await session.fill(github.loginField, login);
  await session.fill(github.passwordField, password);
  await session.click(github.primaryButton);
  await session.fill(github.otpField, speakeasy.totp({secret, encoding: `base32`}));

  await page.waitForTimeout(1000);

  if (session.page.url().includes(`two-factor`)) {
    await session.click(github.primaryButton);
  }

  await session.exists(app.topbar.signOutButton);

  expect(session.page.url()).toContain(url);

  await page.context().storageState({path: `playwright/.auth/user.json`});
});
