import {Page} from 'playwright-webkit';
import speakeasy from 'speakeasy';
import {assertIsString} from '../utils/assert-is-string';

export class App {
  readonly page: Page;
  readonly origin: string;

  readonly #login: string;
  readonly #password: string;
  readonly #secret: string;

  constructor(page: Page) {
    this.page = page;

    const origin = process.env.ITEST_ORIGIN;
    const login = process.env.ITEST_LOGIN;
    const password = process.env.ITEST_PASSWORD;
    const secret = process.env.ITEST_SECRET;

    assertIsString(origin, 'process.env.ITEST_ORIGIN');
    assertIsString(login, 'process.env.ITEST_LOGIN');
    assertIsString(password, 'process.env.ITEST_PASSWORD');
    assertIsString(secret, 'process.env.ITEST_SECRET');

    this.origin = origin;
    this.#login = login;
    this.#password = password;
    this.#secret = secret;
  }

  async setColorScheme(colorScheme: 'dark' | 'light'): Promise<void> {
    await this.page.evaluate(
      (_colorScheme) =>
        localStorage.setItem('colorSchemeSelection', _colorScheme),
      colorScheme
    );
  }

  async setSortOrder(sortOrder: 'timeAsc'): Promise<void> {
    await this.page.evaluate(
      (_sortOrder) => localStorage.setItem('sortOrder', _sortOrder),
      sortOrder
    );
  }

  async setOptimalViewportSize(): Promise<void> {
    await this.page.setViewportSize({width: 1024, height: 468});
  }

  async blurAllControls(): Promise<void> {
    await this.page.click('body');
  }

  async signIn(): Promise<void> {
    await this.page.click('button:has-text("Sign in")');
    await this.page.fill('#login_field', this.#login);
    await this.page.fill('#password', this.#password);
    await this.page.click('.btn-primary:has-text("Sign in")');

    await this.page.fill(
      '#otp',
      speakeasy.totp({secret: this.#secret, encoding: 'base32'})
    );

    await this.page.click('.btn-primary:has-text("Verify")');
    await this.page.waitForSelector('button:has-text("Sign out")');
  }
}
