// @ts-ignore
import type {Browser, Page} from 'playwright-webkit';
// @ts-ignore
import {webkit} from 'playwright-webkit';
import type {NodeSet} from 'sonnar';

export class API {
  static async webkit(): Promise<API> {
    const browser = await webkit.launch();

    return new API(browser, await browser.newPage());
  }

  private constructor(readonly browser: Browser, readonly page: Page) {}

  async click(nodeSet: NodeSet): Promise<void> {
    await this.page.click(`xpath=` + nodeSet.expression);
  }

  async fill(nodeSet: NodeSet, text: string): Promise<void> {
    await this.page.fill(`xpath=` + nodeSet.expression, text);
  }

  async exists(nodeSet: NodeSet): Promise<void> {
    await this.page.waitForSelector(`xpath=` + nodeSet.expression);
  }

  async doesNotExist(nodeSet: NodeSet): Promise<void> {
    expect(await this.page.$(`xpath=` + nodeSet.expression)).toBeNull();
  }
}
