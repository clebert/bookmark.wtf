import {Browser, Page, webkit} from 'playwright-webkit';
import {Discriminator, VirtualNode, pseudoClass} from 'sonnar';

export class API {
  static async webkit(): Promise<API> {
    const browser = await webkit.launch();

    return new API(browser, await browser.newPage());
  }

  readonly firstChild = pseudoClass(':first-child');

  constructor(readonly browser: Browser, readonly page: Page) {}

  async click(node: VirtualNode<any>): Promise<void> {
    await this.page.click(node.selector);
  }

  async fill(node: VirtualNode<any>, text: string): Promise<void> {
    await this.page.fill(node.selector, text);
  }

  async exists(node: VirtualNode<any>): Promise<void> {
    await this.page.waitForSelector(node.selector);
  }

  async doesNotExist(node: VirtualNode<any>): Promise<void> {
    expect(await this.page.$(node.selector)).toBeNull();
  }

  /**
   * https://playwright.dev/docs/selectors#text-selector
   */
  hasText(value: string): Discriminator {
    return pseudoClass(`:has-text(${JSON.stringify(value)})`);
  }
}
