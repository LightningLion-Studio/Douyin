import { DataSource } from "typeorm";
import { Video } from "./databases/id.entity.js";
import { getResult } from "./douyin.js";

const dataSource = new DataSource({
  type: "mysql",
  host: "gz-cynosdbmysql-grp-4ywssxjx.sql.tencentcdb.com",
  port: 25018,
  username: "community",
  password: "Gh14789632",
  database: "douyin",
  synchronize: true,
  logging: true,
  entities: [Video],
});
await dataSource.initialize();

const interval = async () => {
  const value = await getResult();
  const repository = dataSource.getRepository(Video);

  for (let i = 0; i < value.length; i++) {
    const checkVideo = await repository.findOneBy({
      videoID: value[i],
    });
    if (checkVideo) continue;

    const video = new Video();
    video.videoID = value[i];
    await dataSource.getRepository(Video).save(video);
  }
};

setInterval(interval, 10000);
