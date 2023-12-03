import type { Browser, Page } from "puppeteer";
import { Closer } from "./closer";

export class Douyin {
  private page: Page;
  private closer: Closer = new Closer();

  constructor(
    private readonly imgCallBack: (alts: string[]) => void | Promise<void>,
    private browser: Browser,
    private readonly interval: number = 3000
  ) {
    this.init();
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
    // 创建一个新的页面
    this.page = await this.browser.newPage();
    // 前往抖音网页
    await this.page.goto("https://www.douyin.com/");
    // 关闭登录弹窗
    this.closer.begin(this.page, ".dy-account-close");
    // 关闭老版验证弹窗
    this.closer.begin(this.page, ".verify-bar-close");
    // 关闭新版验证弹窗
    this.closer.begin(this.page, ".vc-captcha-close-btn");

    setInterval(async () => {
      // 点击分享按钮
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
