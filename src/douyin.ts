import puppeteer, { Browser, Page } from "puppeteer";

export class Douyin {
  private page: Page;

  constructor(
    private readonly imgCallBack: (alts: string[]) => void | Promise<void>,
    private browser: Browser,
    private readonly interval: number = 3000
  ) {
    this.init();
  }

  private async closeLogin() {
    try {
      const waiter = await this.page.waitForSelector(".dy-account-close");
      await waiter.click();
      this.closeLogin();
    } catch (error) {
      this.closeLogin();
    }
  }

  private async closeVerify() {
    try {
      const waiter = await this.page.waitForSelector(".verify-bar-close");
      await waiter.click();
      this.closeVerify();
    } catch (error) {
      this.closeVerify();
    }
  }

  private async clickNext() {
    const waiter = await this.page.waitForSelector(".xgplayer-playswitch-next");
    await waiter.click();
  }

  public async getImgAlts() {
    const imgs = await this.page.$$eval("img", (imgs) =>
      imgs
        .map((img) => img.getAttribute("alt"))
        .filter((alt) => alt)
        .filter((alt) => alt.includes("https://v.douyin.com"))
    );
    await this.imgCallBack(imgs);
    return imgs;
  }

  private async init() {
    this.page = await this.browser.newPage();
    await this.page.goto("https://www.douyin.com/");
    this.closeLogin();
    this.closeVerify();

    setInterval(async () => {
      const shareButton = await this.page.$$(
        'div[data-e2e="video-player-share"]'
      );
      for (const item of shareButton) {
        try {
          const boundingBox = await item.boundingBox();
          if (boundingBox) {
            await this.page.mouse.move(
              boundingBox.x + boundingBox.width / 2,
              boundingBox.y + boundingBox.height / 2
            );
            await this.page.waitForTimeout(100);
            await this.getImgAlts();
          } else {
            console.error("box error");
          }
        } catch (error) {
          console.error("click error");
        }
      }
      await this.clickNext();
    }, this.interval);
  }
}
