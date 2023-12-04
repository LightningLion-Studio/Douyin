import { Page } from "puppeteer";

export class Closer {
  async begin<T extends string>(page: Page, selector: T) {
    try {
      const waiter = await page.waitForSelector(selector);
      await waiter.click();
      console.log(`关闭${selector}弹窗成功`);
      this.begin(page, selector);
    } catch (error) {
      console.log(`关闭${selector}弹窗失败 没有检测到弹窗`);
      this.begin(page, selector);
    }
  }
}
