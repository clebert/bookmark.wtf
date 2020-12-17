import {Page} from 'playwright-webkit';
import speakeasy from 'speakeasy';
import {assertIsString} from '../utils/assert-is-string';

export class App {
  readonly page: Page;
  readonly baseUrl: string;

  readonly #login: string;
  readonly #password: string;
  readonly #secret: string;

  constructor(page: Page) {
    this.page = page;

    const baseUrl = process.env.APP_BASE_URL;
    const login = process.env.ITEST_LOGIN;
    const password = process.env.ITEST_PASSWORD;
    const secret = process.env.ITEST_SECRET;

    assertIsString(baseUrl, 'process.env.APP_BASE_URL');
    assertIsString(login, 'process.env.ITEST_LOGIN');
    assertIsString(password, 'process.env.ITEST_PASSWORD');
    assertIsString(secret, 'process.env.ITEST_SECRET');

    this.baseUrl = baseUrl;
    this.#login = login;
    this.#password = password;
    this.#secret = secret;
  }

  async signIn(): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation({url: /^https:\/\/github\.com\/login/}),
      this.page.click('"Sign in"'),
    ]);

    await this.page.fill('#login_field', this.#login);
    await this.page.fill('#password', this.#password);

    await Promise.all([
      this.page.waitForNavigation({
        url: /^https:\/\/github\.com\/sessions\/two-factor/,
      }),

      this.page.click('"Sign in"'),
    ]);

    const token = speakeasy.totp({secret: this.#secret, encoding: 'base32'});

    await this.page.fill('#otp', token);

    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click('"Verify"'),
    ]);

    await this.page.waitForSelector(`"Signed in as ${this.#login}."`);
  }
}
