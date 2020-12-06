import {Page} from 'playwright';
import {assertIsString} from '../utils/assert-is-string';

export class App {
  readonly #page: Page;
  readonly #login: string;
  readonly #password: string;

  constructor(page: Page) {
    this.#page = page;

    const login = process.env.ITEST_LOGIN;
    const password = process.env.ITEST_PASSWORD;

    assertIsString(login, 'process.env.ITEST_LOGIN');
    assertIsString(password, 'process.env.ITEST_PASSWORD');

    this.#login = login;
    this.#password = password;
  }

  async signIn(): Promise<void> {
    await Promise.all([
      this.#page.waitForNavigation({
        url: /^https:\/\/github\.com\/login/,
        waitUntil: 'networkidle',
      }),

      this.#page.click('"Sign in"'),
    ]);

    await this.#page.fill('#login_field', this.#login);
    await this.#page.fill('#password', this.#password);

    await Promise.all([
      this.#page.waitForNavigation({
        url: /^https:\/\/bookmark\.wtf\//,
        waitUntil: 'networkidle',
      }),

      this.#page.click('"Sign in"'),
    ]);

    await this.#page.waitForSelector(`"Signed in as ${this.#login}."`);
  }
}
