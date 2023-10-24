import puppeteer, { Page } from "puppeteer";

const broswer = await puppeteer.launch({ headless: false });
const page = await broswer.newPage();
page.goto("https://www.douyin.com");

class Douyin {
  constructor(private readonly page: Page) {
    this.closeLogin();
  }

  private async closeLogin() {
    const waiter = await this.page.waitForSelector(".dy-account-close");
    waiter.click();
  }

  public async onClickNext<T>(callBack: () => T): Promise<true> {
    return new Promise(async (resolve) => {
      const waiter = await this.page.waitForSelector(
        ".xgplayer-playswitch-next"
      );
      let count = 1;
      const interval = setInterval(async () => {
        await waiter.click();
        await callBack();
        count++;
        if (count > 5) {
          clearInterval(interval);
          resolve(true);
        }
      }, 1000);
    });
  }
}

const douyin = new Douyin(page);
const realResult: string[] = [];

await douyin.onClickNext(async () => {
  const selector = await page.$$("div[data-e2e-vid]");
  for (let i = 0; i < selector.length; i++) {
    const item = selector[i];
    const result: string = await item.evaluate((node) => {
      return node.attributes["data-e2e-vid"].value;
    });
    realResult.push(result);
  }
});

console.log([...new Set(realResult)]);
