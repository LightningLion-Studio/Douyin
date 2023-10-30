import { writeFileSync } from "fs";
import { join } from "path";
import puppeteer, { Page } from "puppeteer";

class Douyin {
  constructor(private readonly page: Page) {
    // this.screenShot();
    this.closeVerify();
    this.closeLogin();
  }

  private screenShot() {
    setInterval(async () => {
      const screenshot = await this.page.screenshot();
      writeFileSync(
        join(process.cwd(), "static", `${new Date().toISOString()}.png`),
        screenshot
      );
    }, 1000);
  }

  private async closeLogin() {
    this.closeVerify();
    try {
      const waiter = await this.page.waitForSelector(".dy-account-close");
      waiter.click();
    } catch (error) {
      this.closeLogin();
    }
  }

  private async closeVerify() {
    try {
      const waiter = await this.page.waitForSelector("#verify-bar-close");
      waiter.click();
    } catch (error) {
      console.error(error);
    }
  }

  public async onClickNext<T>(callBack: () => T): Promise<true> {
    return new Promise(async (resolve) => {
      const waiter = await this.page.waitForSelector(
        ".xgplayer-playswitch-next"
      );
      this.closeVerify();
      this.closeVerify();
      this.closeVerify();
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

const broswer = await puppeteer.launch({ headless: false });
const page = await broswer.newPage();

export async function getResult() {
  page.goto("https://www.douyin.com");
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

  return [...new Set(realResult)];
}
