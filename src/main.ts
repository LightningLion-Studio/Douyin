import puppeteer from "puppeteer";
import { dataSource } from "./datasource";
import { Douyin } from "./douyin";
import { Share } from "./share.entity";
import { Interval } from "./more";

async function bootStrap() {
  await dataSource.initialize();
  const Repository = dataSource.getRepository(Share);
  const broswer = await puppeteer.launch({ headless: false });

  Interval(() => {
    new Douyin(async (datas) => {
      for (const item of datas) {
        const share = await Repository.findOneBy({ share: item });
        if (share) continue;
        const newShare = new Share();
        newShare.share = item;
        await Repository.save(newShare);
      }
    }, broswer);
  }, 5);
}
bootStrap();
