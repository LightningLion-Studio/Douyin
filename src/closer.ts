import { Page } from "puppeteer";

export class Closer {
  async begin<T extends string>(page: Page, selector: T) {
    try {
      const waiter = await page.waitForSelector(selector);
      await waiter.click();
      this.begin(page, selector);
    } catch (error) {
      this.begin(page, selector);
    }
  }
}
