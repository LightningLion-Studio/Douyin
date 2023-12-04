import { Repository } from "typeorm";
import { Share } from "./share.entity";

export class Checker {
  private static lastId: number;

  public static async check(shareRepository: Repository<Share>) {
    const [data] = await shareRepository.find({
      order: {
        id: "DESC",
      },
      take: 1,
    });
    if (this.lastId) {
      if (data.id === this.lastId) {
        console.log("检测到没有新数据诞生，退出主进程");
        process.exit();
      }
    }
    this.lastId = data.id;
    console.log("检测通过，有新数据诞生 继续保持抓取状态");
  }
}
