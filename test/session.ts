import type {Browser, Page} from '@playwright/test';
import type {NodeSet} from 'sonnar';

import {expect} from '@playwright/test';

export class Session {
  constructor(
    readonly browser: Browser,
    readonly page: Page,
  ) {}

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
