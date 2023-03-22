import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';
import speakeasy from 'speakeasy';
import {assertIsString} from '../utils/assert-is-string.js';
import {app} from './app.js';
import {containsText} from './contains-text.js';
import {github} from './github.js';
import {Session} from './session.js';
import {takeScreenshot} from './take-screenshot.js';

const origin = process.env.E2E_TEST_ORIGIN;

assertIsString(origin, `process.env.E2E_TEST_ORIGIN`);

describe(`bookmark.wtf`, () => {
  let session: Session;
  let uid: string;

  beforeAll(async () => {
    session = await Session.webkit();
    uid = String(Date.now());
  });

  afterAll(async () => {
    await session.browser.close();
  });

  test(`signing in`, async () => {
    const login = process.env.E2E_TEST_LOGIN;
    const password = process.env.E2E_TEST_PASSWORD;
    const secret = process.env.E2E_TEST_SECRET;

    assertIsString(login, `process.env.E2E_TEST_LOGIN`);
    assertIsString(password, `process.env.E2E_TEST_PASSWORD`);
    assertIsString(secret, `process.env.E2E_TEST_SECRET`);

    const url = origin + `/9803bde974539a8992c0515b28db439b?foo=bar`;

    await session.page.goto(url);
    await session.click(app.topbar.signInButton);
    await session.fill(github.loginField, login);
    await session.fill(github.passwordField, password);
    await session.click(github.primaryButton);
    await session.fill(github.otpField, speakeasy.totp({secret, encoding: `base32`}));
    await session.exists(app.topbar.signOutButton);

    expect(session.page.url()).toBe(url);
  });

  test(`taking a screenshot in light mode`, async () => {
    await takeScreenshot(session, origin, `light`);
  });

  test(`taking a screenshot in dark mode`, async () => {
    await takeScreenshot(session, origin, `dark`);
  });

  test(`cancel creating a collection`, async () => {
    await session.page.goto(origin);
    await session.click(app.collectionControl.newButton);
    await session.fill(app.newCollectionForm.descriptionField, `foo` + uid);
    await session.click(app.newCollectionForm.cancelButton);
    await session.doesNotExist(app.collectionItem(containsText(`foo` + uid)).self);
  });

  test(`creating a collection`, async () => {
    await session.page.goto(origin);
    await session.click(app.collectionControl.newButton);
    await session.fill(app.newCollectionForm.descriptionField, `foo` + uid);

    const response = session.page.waitForResponse(/github/);

    await session.click(app.newCollectionForm.createButton);
    await response;
    await session.exists(app.collectionItem(containsText(`foo` + uid)).self);
  });

  test(`cancel updating a collection`, async () => {
    await session.page.goto(origin);
    await session.click(app.collectionItem(containsText(`foo` + uid)).editButton);
    await session.fill(app.editCollectionForm(1).descriptionField, `bar` + uid);
    await session.click(app.editCollectionForm(1).cancelButton);
    await session.doesNotExist(app.collectionItem(containsText(`bar` + uid)).self);
    await session.exists(app.collectionItem(containsText(`foo` + uid)).self);
  });

  test(`updating a collection`, async () => {
    await session.page.goto(origin);
    await session.click(app.collectionItem(containsText(`foo` + uid)).editButton);
    await session.fill(app.editCollectionForm(1).descriptionField, `bar` + uid);

    const response = session.page.waitForResponse(/github/);

    await session.click(app.editCollectionForm(1).updateButton);
    await response;
    await session.doesNotExist(app.collectionItem(containsText(`foo` + uid)).self);
    await session.exists(app.collectionItem(containsText(`bar` + uid)).self);
  });

  test(`deleting a collection`, async () => {
    await session.page.goto(origin);

    const response = session.page.waitForResponse(/github/);

    await session.click(app.collectionItem(containsText(`bar` + uid)).deleteButton);
    await session.click(app.collectionItem(containsText(`bar` + uid)).deleteButton);
    await response;
    await session.doesNotExist(app.collectionItem(containsText(`bar` + uid)).self);
  });
});
